import khFlag from '../assets/images/kh-flag.png'
import enFlag from '../assets/images/usa-flag.png'
import { useTranslation } from 'react-i18next';
import {useEffect, useState} from "react";

export default function Button() {
    const { i18n } = useTranslation();
    const [lang, setLang] = useState<string | null>(null);

    useEffect(()=>{
        const localeEn = localStorage.getItem('i18nextLng');
        setLang(localeEn);
    });
    const triggerKhClick = () => {
        i18n.changeLanguage('kh');
    };

    const triggerEnClick = () => {
        i18n.changeLanguage('en');
    };

    return (
        <div>
            <button
                className={lang != 'en' ? "hidden" : "block"}
                onClick={triggerKhClick}
            >
                <img
                    src={enFlag}
                    alt="usa-flag"
                    width="2000" height="2000"
                    className="w-[32px] h-full rounded-[4px]"
                />
            </button>
            <button
                className={lang != 'en' ? "block" : "hidden"}
                onClick={triggerEnClick}
            >
                <img
                    src={khFlag}
                    alt="kh-flag"
                    width="2000" height="2000"
                    className="w-[32px] h-full rounded-[4px]"
                />
            </button>
        </div>
    );
}
