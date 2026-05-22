import Image from "next/image";
import { ButtonLink } from "@/components/button-link";

type PricingFeature = {
  label: string;
  included: boolean;
};

function getFeatureIcon(included: boolean, highlighted: boolean) {
  if (highlighted) {
    return included ? "/assets/icon-circle-check.svg" : "/assets/icon-circle-x.svg";
  }

  return included ? "/assets/pricing-circle-check.svg" : "/assets/pricing-circle-x.svg";
}

export function PricingCard({
  title,
  description,
  price,
  period,
  features,
  highlighted = false,
  badge,
}: {
  title: string;
  description: string;
  price: string;
  period: string;
  features: PricingFeature[];
  highlighted?: boolean;
  badge?: string;
}) {
  return (
    <article
      className={
        highlighted
          ? "relative flex min-h-[600px] w-full max-w-[410px] flex-col rounded-xl bg-[#0f8276] px-7 py-10 text-white shadow-sm sm:min-h-[675px] sm:px-11 sm:py-12"
          : "flex min-h-[600px] w-full max-w-[410px] flex-col rounded-xl border border-[#d8dde5] bg-[#f4f5f7] px-7 py-10 text-[#1d2433] shadow-sm sm:min-h-[675px] sm:px-11 sm:py-12"
      }
    >
      {badge ? (
        <div className="absolute right-6 top-6 rounded-full bg-white px-4 py-1.5 text-sm font-extrabold text-[#0f8276] shadow-sm">
          {badge}
        </div>
      ) : null}

      <div className="text-center">
        <h2 className="text-2xl font-extrabold leading-tight sm:text-[28px]">{title}</h2>
        <p
          className={
            highlighted
              ? "mx-auto mt-3 max-w-[315px] text-base font-medium leading-6 text-white/95"
              : "mx-auto mt-3 max-w-[315px] text-base font-medium leading-6 text-[#657181]"
          }
        >
          {description}
        </p>
        <div className="mt-7 flex items-end justify-center sm:mt-8">
          <span className="text-[40px] font-extrabold leading-none sm:text-[48px]">{price}</span>
          <span className={highlighted ? "mb-1 text-sm text-white" : "mb-1 text-sm text-[#1d2433]"}>
            /{period}
          </span>
        </div>
      </div>

      <ul className="mt-10 space-y-5 sm:mt-12 sm:space-y-6">
        {features.map((feature) => (
          <li
            key={feature.label}
            className="flex items-start gap-3 text-base font-semibold leading-6 sm:text-lg"
          >
            <Image
              src={getFeatureIcon(feature.included, highlighted)}
              alt={feature.included ? "Fitur tersedia" : "Fitur tidak tersedia"}
              width={24}
              height={24}
              className={highlighted ? "mt-0.5 brightness-0 invert" : "mt-0.5"}
            />
            <span
              className={
                !feature.included && !highlighted
                  ? "text-[#657181]"
                  : highlighted
                    ? "text-white"
                    : "text-[#1d2433]"
              }
            >
              {feature.label}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex justify-center pt-10">
        <ButtonLink href="/register" variant={highlighted ? "light" : "primary"}>
          Mulai Gratis
        </ButtonLink>
      </div>
    </article>
  );
}
