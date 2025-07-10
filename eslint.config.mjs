import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Mevcut Next.js ve TypeScript yapılandırmalarına ek olarak kendi kurallarımızı tanımlayacağız.
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Bu blok, bizim özel ESLint kurallarımızı içerecek.
    rules: {
      // Her satırın sonunda noktalı virgül (semicolon) olmasını zorunlu kılmaz.
      "semi": "off",

      // console.log() kullanılmasına izin verir. Geliştirme aşamasında çok kullanışlıdır.
      "no-console": "off",

      // Boş arayüzlere izin verir (örneğin {}, boş objeler).
      "@typescript-eslint/no-empty-interface": "off",

      // Kullanılmayan değişkenlere uyarı verir, hata değil.
      "@typescript-eslint/no-unused-vars": "warn",

      // require() kullanılmasına izin verir (genellikle import kullanılır, ancak bazı legacy kodlarda gerekebilir).
      "@typescript-eslint/no-var-requires": "off",

      // Proptypes kullanımını zorunlu kılmaz (React'ta prop-types yerine TypeScript kullanıyoruz).
      "react/prop-types": "off",

      // React bileşenlerinde display name olmasını zorunlu kılmaz.
      "react/display-name": "off",

      // Arrow fonksiyonlarını direkt döndürmeye izin verir (kısa ve okunabilir kod için).
      "react/jsx-no-bind": "off",

      // Bu kurallar 'eslint-plugin-import'a ait ve bu yapıda doğrudan etkili olmayabilir.
      // Eğer ileride import hataları alırsanız bunları devre dışı bırakmayı düşünebiliriz.
      // "import/no-unresolved": "off",
      // "import/prefer-default-export": "off",

      // useEffect bağımlılık dizisindeki eksik bağımlılıklar için hata vermez (dikkatli kullanılmalı).
      // Bu kural 'eslint-plugin-react-hooks'a aittir ve 'next/core-web-vitals' içinde zaten yönetiliyor olabilir.
      "react-hooks/exhaustive-deps": "off",

      // JSX'te boolean prop'ların true olarak geçilmesine izin verir (örn. <MyComponent disabled />).
      "react/jsx-boolean-value": "off",

      // Destructuring kullanımını zorunlu kılmaz.
      "prefer-destructuring": "off"
    }
  }
];

export default eslintConfig;