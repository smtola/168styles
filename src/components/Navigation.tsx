import Button from "./Button";
import { useTranslation } from 'react-i18next';
import '../i18n';
import {RefObject, useEffect, useMemo, useState} from "react";

interface Category {
    _RowNumber: number;
    cate_id: string;
    cate_name: string;
    related_items: {
        "id": string;
    };
}

interface Products {
    _RowNumber: number;
    item_id: string;
    item_name: string;
    description: string;
    size: string;
    color: string;
    category: string;
    unit: string;
    unit_price: string;
    current_stock: string;
    image: string;
    image_url: string;
    image_display_1:string;
    image_display_2:string;
    image_display_3:string;
    image_display_4:string;
    image_display_5:string;
}

interface NavigationProps {
    searchParams:(data:string) => void;
    containScroll:RefObject<HTMLDivElement | null>;

}

const logo =
    'https://www.appsheet.com/fsimage.png?appid=4847193e-4ce7-426f-92df-d5fed06513c0&datasource=google&filename=DocId%3D1EkQLqTzlIJlP-fJ7xIw83w8EDdB1Mrya&signature=ad96eb3f66e70c2917227e9c6b9f915e3fd86982be99ad6a2b2956bc9de20306&tableprovider=google&userid=935036077';

export default function Navigation({ searchParams, containScroll}: NavigationProps) {
    const [category, setCategory] = useState<Category[] | null>(null);
    const [data, setData] = useState<Products[] | null>(null);
    const [params, setSearchParam] = useState<string>();
    const [activeSection, setActiveSection] = useState<string>("section_49e94e32");

    const [isLoading, setIsLoading] = useState(true);
    const { t } = useTranslation();

    useEffect(()=>{
        fetchCateData();
        fetchProData();
    },[]);
    const fetchCateData = async () => {
        const apiKey = 'V2-nszI0-qG9ij-Z04yR-gbemX-K9Zze-TgVdE-JX73e-imyux';
        const tableName = "category";
        const appId = '4847193e-4ce7-426f-92df-d5fed06513c0';
        const endPoint = `https://api.appsheet.com/api/v2/apps/${appId}/tables/${tableName}/query`;

        setIsLoading(true);
        try{
            const response = await fetch(endPoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    applicationAccessKey: apiKey,
                },
                body: JSON.stringify({
                    Action: "Find",
                    Properties: {
                        Locale: "en-US",
                        Timezone: "UTC",
                    },
                    Rows: [],
                }),
            });
            if (!response.ok) {
                throw new Error("Failed to fetch data from AppSheet");
            }

            const result: Category[] = await response.json();
            setCategory(result);
        }catch (err){
            console.log((err as Error).message);
        }finally{
            setIsLoading(false);
        }
    }

    const fetchProData = async () => {
        const apiKey = 'V2-nszI0-qG9ij-Z04yR-gbemX-K9Zze-TgVdE-JX73e-imyux';
        const tableName = "item";
        const appId = '4847193e-4ce7-426f-92df-d5fed06513c0';
        const endPoint = `https://api.appsheet.com/api/v2/apps/${appId}/tables/${tableName}/query`;

        setIsLoading(true);
        try{
            const response = await fetch(endPoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    applicationAccessKey: apiKey,
                },
                body: JSON.stringify({
                    Action: "Find",
                    Properties: {
                        Locale: "en-US",
                        Timezone: "UTC",
                    },
                    Rows: [],
                }),
            });
            if (!response.ok) {
                throw new Error("Failed to fetch data from AppSheet");
            }

            const result: Products[] = await response.json();
            setData(result);
        }catch (err){
            console.log((err as Error).message);
        }finally{
            setIsLoading(false);
        }
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        searchParams(query);
        setSearchParam(query);
    }

    const filteredData = useMemo(() => {
        if (!data) return [];
        return data.filter((product) =>
            params ? product.item_name.toLowerCase().includes(params.toLowerCase()) : true
        );
    }, [data, params]);

    const capitalize = (str: string): string =>
        str
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

    useEffect(() => {
        const scrollContainer = containScroll.current;

        const handleScroll = (): void => {
            if (!scrollContainer) return;

            const sections = Array.from(scrollContainer.getElementsByClassName("section")) as HTMLElement[];

            if (sections.length === 0) {
                return;
            }

            let current: string = "section_49e94e32"; // Default section
            sections?.forEach((section) => {
                const rect = section.getBoundingClientRect();

                if (rect.top <= 180 && rect.top + rect.height > 0) {
                    current = section.getAttribute("id") || current;
                }
            });

            setActiveSection(current);
        };

        if (scrollContainer) {
            // Initial scroll check
            handleScroll();

            // Attach scroll event listener
            scrollContainer.addEventListener("scroll", handleScroll);
        } else {
            console.warn('Scroll container is not defined.');
        }

        // Cleanup the event listener on unmount
        return () => {
            scrollContainer?.removeEventListener("scroll", handleScroll);
        };
    }, []);
    const getLinkClass = (section: string) =>
        activeSection === section
            ? "rounded-full border-2 border-[#eb1c25] px-3 py-1 bg-[#eb1c25]/20 text-[#eb1c25] transition-all duration-[300ms]"
            : "rounded-full border-2 border-[#eb1c25] px-3 py-1 text-[#000000] transition-all duration-[300ms]";

    const scrollToSection = (section: string) => {
        const element = document.getElementById(section);

        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    if (isLoading) {
        return ('');
    }

    return (
      <nav className="bg-white w-full p-3 z-50 max-w-screen-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={logo} width="3000" height="2000" alt="logo" className="w-[32px] h-[32px]"/>
            <h1 className=" font-[700] text-[24px] text-black">168styles</h1>
          </div>
           <Button />
        </div>

        <div>
          <ul className="flex space-x-2 overflow-x-auto py-4">
              {filteredData.length === 0 ? (
                  <h2 className="text-sm text-center font-semibold text-gray-700">Data not exist!</h2>
              ) : (
                  category
                      ?.filter((cate) =>
                          filteredData.some((item) => item.category === cate.cate_id) // Check if any items match the category ID
                      )
                      .map((cate) => (
                          <li key={cate.cate_id} className="cursor-pointer whitespace-nowrap rounded-lg">
                              <button
                                  onClick={() => scrollToSection(`section_${cate.cate_id}`)}
                                  className="transition-all group"
                              >
                                  <div className={getLinkClass(`section_${cate.cate_id}`)}>
                                <span className="text-[18px] text-center font-semibold decoration-[#fcd28a] decoration-[3px] underline-offset-4">
                                  {capitalize(cate.cate_name)}
                                </span>
                                  </div>
                              </button>
                          </li>
                      ))
              )
              }
          </ul>
        </div>

        <div className="pb-3">
          <div className="grid w-full items-center gap-1.5">
            <div className="relative">
              <input
                  className="flex w-full border border-gray-400 border-input text-sm text-black shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 rounded-full h-9 px-3 py-1 bg-white"
                  placeholder={t('search')}
                  type="text"
                  name="input"
                  onChange={handleSearchChange}
              />
              <div className="absolute bottom-0 right-0 mr-3 flex h-9 w-9 items-center justify-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9ca3af"
                    className="h-5 w-5 text-primary"
                >
                  <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                  <path d="M21 21l-6 -6"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </nav>
  );
}
