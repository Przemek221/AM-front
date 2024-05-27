import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './en.json';
import pl from './pl.json';

const myTranslation = i18n.use(initReactI18next).init({
    compatibilityJSON: "v3",
    lng: 'en',
    fallbackLng: 'en',
    resources: {
        en: en,
        pl: pl,
    },
    interpolation: {
        escapeValue: false // react already safes from xss
    }
});

export default myTranslation;
