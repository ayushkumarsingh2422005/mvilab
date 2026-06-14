"use client";

import { useState } from "react";
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";

type PasswordFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
  id?: string;
};

const inputClassName =
  "w-full rounded-lg border border-[#d8d8d8] py-2.5 pl-3 pr-11 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

export function PasswordField({
  label,
  value,
  onChange,
  autoComplete = "current-password",
  required = true,
  minLength,
  id,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label className="block" htmlFor={fieldId}>
      <span className="mb-1.5 block text-sm font-medium text-[#444]">{label}</span>
      <div className="relative">
        <input
          id={fieldId}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          required={required}
          minLength={minLength}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={inputClassName}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-[#666] transition hover:text-primary-dark"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
        >
          {visible ? <HiOutlineEyeSlash size={20} aria-hidden /> : <HiOutlineEye size={20} aria-hidden />}
        </button>
      </div>
    </label>
  );
}
