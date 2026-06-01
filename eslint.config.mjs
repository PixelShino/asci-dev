// Flat-config для ESLint 9 (Next 16). `eslint-config-next` экспортируется уже
// как массив flat-config (core-web-vitals + typescript), FlatCompat не нужен.
import next from "eslint-config-next";

const config = [
  {
    // Генерируемые и вендорные артефакты — не линтим.
    ignores: [
      ".next/**",
      "next-env.d.ts",
      "payload-types.ts",
      "app/(payload)/**",
      "migrations/**",
      "scripts/**",
    ],
  },
  ...next,
  {
    rules: {
      // В терминальной эстетике `//` и `/* */` — намеренный текст в JSX
      // (метки вида «// EMAIL*»), а не случайные комментарии.
      "react/jsx-no-comment-textnodes": "off",
      // Новые advisory-правила React Compiler (eslint-plugin-react-hooks v6).
      // Код не на React Compiler — держим их как `warn` (видимость без падения
      // линта), правим точечно по мере надобности, а не ломаем рабочие эффекты.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/static-components": "warn",
      "react-hooks/purity": "warn",
      // У проекта `images.unoptimized: true` — next/image не даёт выгоды,
      // для blob/внешних URL осознанно используем <img>.
      "@next/next/no-img-element": "off",
    },
  },
];

export default config;
