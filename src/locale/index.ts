import { createI18n } from "vue-i18n";
import en from './en.ts'
import ja from './ja.ts'
import zh from './zh.ts'

const getDefaultLocale = () => {
  const savedLocale = localStorage.getItem('OPCENTER_LANG');
  if (savedLocale && ['zh', 'en', 'ja'].includes(savedLocale)) {
    return savedLocale;
  }
  return 'zh';
}

const i18n = createI18n({
  locale: getDefaultLocale(),
  legacy: false,
  messages: {
    en: en,
    ja: ja,
    zh: zh
  }
})

export const setLocale = (locale: string) => {
  i18n.global.locale.value = locale;
  localStorage.setItem('OPCENTER_LANG', locale);
}

export default i18n