"use client";

import type { NeedGroup, NeedStatus } from "@/lib/partners-copy";

import clsx from "clsx";
import { track } from "@vercel/analytics";
import { useId, useState } from "react";

interface Labels {
  status: Record<NeedStatus, string>;
  vote: string;
  voted: string;
  formTitle: string;
  formLead: string;
  formGym: string;
  formGymPlaceholder: string;
  formRole: string;
  roles: string[];
  formContact: string;
  formNote: string;
  formNotePlaceholder: string;
  formPicked: string;
  formNone: string;
  formSend: string;
  /** "{gym}" is filled in. */
  mailSubject: string;
  /** Line labels for the email body. */
  mail: {
    gym: string;
    role: string;
    contact: string;
    needs: string;
    none: string;
    note: string;
  };
}

/**
 * What a gym needs, grouped by the owner's own questions, each marked live,
 * in progress or planned. Owners tick "I need this" on anything, then send
 * their picks by email. Every tick is also counted (Vercel Analytics,
 * `gym_need_vote`), so demand shows even when nobody sends the email.
 */
export function NeedsBoard({
  groups,
  labels,
  email,
}: {
  groups: NeedGroup[];
  labels: Labels;
  email: string | null;
}) {
  const id = useId();
  const [picked, setPicked] = useState<string[]>([]);
  const [gym, setGym] = useState("");
  const [role, setRole] = useState(labels.roles[0] ?? "");
  const [contact, setContact] = useState("");
  const [note, setNote] = useState("");
  const all = groups.flatMap((g) => g.needs);

  const toggle = (needId: string, status: NeedStatus) => {
    const on = !picked.includes(needId);

    // Outside the updater: React may run an updater twice.
    if (on) track("gym_need_vote", { need: needId, status });
    setPicked((p) => (on ? [...p, needId] : p.filter((x) => x !== needId)));
  };

  const send = () => {
    if (!email) return;
    const needs = all.filter((n) => picked.includes(n.id));

    track("gym_need_submit", {
      needs: needs.map((n) => n.id).join(","),
      count: needs.length,
    });
    const m = labels.mail;
    const body = [
      `${m.gym}${gym}`,
      `${m.role}${role}`,
      `${m.contact}${contact}`,
      "",
      m.needs,
      ...(needs.length
        ? needs.map((n) => `・${n.title}（${labels.status[n.status]}）`)
        : [m.none]),
      ...(note ? ["", `${m.note}${note}`] : []),
    ].join("\n");

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(
      labels.mailSubject.replace("{gym}", gym),
    )}&body=${encodeURIComponent(body)}`;
  };

  const field =
    "mt-1.5 h-12 w-full rounded-xl border border-line bg-ink px-4 text-[16px] outline-none transition-colors focus:border-cream/40";

  return (
    <div>
      <div className="space-y-12">
        {groups.map((g) => (
          <section key={g.question}>
            <p className="text-[13px] font-bold text-lime-ink tabular">
              {g.stage}
            </p>
            <h3 className="mt-1 text-[20px] font-extrabold tracking-tight sm:text-[24px]">
              {g.question}
            </h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {g.needs.map((n) => {
                const on = picked.includes(n.id);

                return (
                  <li
                    key={n.id}
                    className={clsx(
                      "flex flex-col rounded-2xl border bg-ink-2 p-5 transition-colors",
                      on ? "border-night" : "border-line",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-[17px] font-extrabold">{n.title}</p>
                      <StatusTag
                        label={labels.status[n.status]}
                        status={n.status}
                      />
                    </div>
                    <p className="mt-2 flex-1 text-[14px] leading-[1.75] text-mute">
                      {n.body}
                    </p>
                    <button
                      aria-pressed={on}
                      className={clsx(
                        "mt-4 h-10 self-start rounded-full border px-4 text-[14px] font-bold transition-colors",
                        on
                          ? "border-night bg-night text-day"
                          : "border-line bg-ink text-cream hover:border-cream/30",
                      )}
                      type="button"
                      onClick={() => toggle(n.id, n.status)}
                    >
                      {on ? `✓ ${labels.voted}` : labels.vote}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <section
        aria-labelledby={`${id}-form`}
        className="mt-16 scroll-mt-24 rounded-[28px] border border-line bg-ink-2 p-6 sm:p-10"
        id="contact"
      >
        <h2
          className="text-[26px] font-black tracking-tight sm:text-[34px]"
          id={`${id}-form`}
        >
          {labels.formTitle}
        </h2>
        <p className="mt-2 text-[15px] text-mute">{labels.formLead}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block text-[14px] font-bold">
            {labels.formGym}
            <input
              className={field}
              placeholder={labels.formGymPlaceholder}
              value={gym}
              onChange={(e) => setGym(e.target.value)}
            />
          </label>
          <label className="block text-[14px] font-bold">
            {labels.formContact}
            <input
              className={field}
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </label>
        </div>

        <fieldset className="mt-4">
          <legend className="text-[14px] font-bold">{labels.formRole}</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {labels.roles.map((r) => (
              <button
                key={r}
                aria-pressed={role === r}
                className={clsx(
                  "h-10 rounded-full border px-4 text-[14px] font-semibold transition-colors",
                  role === r
                    ? "border-night bg-night text-day"
                    : "border-line bg-ink text-cream hover:border-cream/30",
                )}
                type="button"
                onClick={() => setRole(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-5">
          <p className="text-[14px] font-bold">{labels.formPicked}</p>
          {picked.length ? (
            <ul className="mt-2 flex flex-wrap gap-2">
              {all
                .filter((n) => picked.includes(n.id))
                .map((n) => (
                  <li key={n.id}>
                    <button
                      className="flex h-9 items-center gap-1.5 rounded-full bg-lime px-3.5 text-[13px] font-bold text-night"
                      type="button"
                      onClick={() => toggle(n.id, n.status)}
                    >
                      {n.title}
                      <span aria-hidden>×</span>
                    </button>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="mt-1.5 text-[14px] text-mute">{labels.formNone}</p>
          )}
        </div>

        <label className="mt-5 block text-[14px] font-bold">
          {labels.formNote}
          <textarea
            className={clsx(field, "h-28 py-3")}
            placeholder={labels.formNotePlaceholder}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </label>

        <button
          className="mt-6 h-13 rounded-full bg-lime px-7 text-[16px] font-bold text-night transition-transform active:translate-y-px disabled:opacity-50"
          disabled={!email}
          type="button"
          onClick={send}
        >
          {labels.formSend}
        </button>
      </section>
    </div>
  );
}

function StatusTag({ status, label }: { status: NeedStatus; label: string }) {
  return (
    <span
      className={clsx(
        "shrink-0 rounded-full px-2.5 py-0.5 text-[12px] font-bold",
        status === "live" && "bg-lime text-night",
        status === "building" && "bg-night text-day",
        status === "idea" && "border border-line text-mute",
      )}
    >
      {label}
    </span>
  );
}
