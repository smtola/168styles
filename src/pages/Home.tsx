// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/pagination";
import Navigation from "../components/Navigation";
import Slidder from "../components/Slidder";
import {useEffect, useMemo, useRef, useState} from "react";
import '../i18n';
import {Link} from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import errorIcon from '../assets/images/data-not-found.png';

import { Pagination } from "swiper/modules";
import google from '../assets/images/googlemap.png';
import facebook from '../assets/images/facebook.png';
import telegram from '../assets/images/telegram.png';
import telephone from '../assets/images/telephone.png';
const logo =
    'https://www.appsheet.com/fsimage.png?appid=4847193e-4ce7-426f-92df-d5fed06513c0&datasource=google&filename=DocId%3D1EkQLqTzlIJlP-fJ7xIw83w8EDdB1Mrya&signature=ad96eb3f66e70c2917227e9c6b9f915e3fd86982be99ad6a2b2956bc9de20306&tableprovider=google&userid=935036077';

interface Category {
    _RowNumber: number;
    cate_id: string;
    cate_name: string;
    related_items: {
        id: string;
    };
}
interface Products {
    item_id: string;
    item_name: string;
    description: string;
    size: string;
    color: string;
    category: string;
    unit_price: number;
    sale_price:number;
    image_url: string;
    image_display_1: string;
    image_display_2: string;
    image_display_3: string;
    image_display_4: string;
    image_display_5: string;
}
function Home() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [category, setCategory] = useState<Category[] | null>(null);
    const [data, setData] = useState<Products[] | null>(null);
    const [params, setParams] = useState<string>();

    const [selectedSize, setSelectedSize] = useState<string>("");
    const [selectedColor, setSelectedColor] = useState<string>("");
    const [qtyChange, setQtyChange] = useState<number>(0);
    const [productId, setProductId] = useState<string>("");
    const [productName, setProductName] = useState<string>("");
    const [customer, setCustomer] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [productPrice, setProductPrice] = useState<number>(0);

    const [btnLoading, setBtnLoading] = useState(true);
    const [modalToggle, setModalToggle] = useState(false);
    const [modelId, setModelId] = useState<string | null>(null);
    const [alert, setAlert] = useState<string | null>(null);

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
        fetchCateData();
        fetchProData();
    },[])
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
            setError((err as Error).message);
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
            setError((err as Error).message);
        }finally{
            setIsLoading(false);
        }
    }
    const handleParams = (value: string): void => {
        setParams(value);
    };
    const filteredData = useMemo(() => {
        if (!data) return [];
        return data.filter((product) =>
            params
                ? product.item_name.toLowerCase().includes(params.toLowerCase())
                : true
        );
    }, [data, params]);
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(value);
    };

    useEffect(() => {
        data?.map((items) => {
            if (items.item_id === modelId) {
                setProductId(items.item_id);
                setProductName(items.item_name);
                setProductPrice(items.unit_price);
            }
        });
    });
    const showModal = (id: string): void => {
        const elementId = `my_modal_${id}`;
        setModelId(id);
        setTimeout(() => {
            const bindingElement = document.getElementById(elementId);
            if (bindingElement) {
                const dialogElement = bindingElement as HTMLDialogElement;
                if (dialogElement && typeof dialogElement.showModal === "function") {
                    dialogElement.showModal();
                } else {
                    console.error(
                        `The element with ID "${elementId}" does not support the "showModal" method. Ensure it's a <dialog> element.`
                    );
                }
            } else {
                console.error(`No element found with ID "${elementId}".`);
            }
        }, 0);
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const apiKey = 'V2-nszI0-qG9ij-Z04yR-gbemX-K9Zze-TgVdE-JX73e-imyux';
        const tableName = "order";
        const appId = '4847193e-4ce7-426f-92df-d5fed06513c0';
        const endPoint = `https://api.appsheet.com/api/v2/apps/${appId}/tables/${tableName}/query`;

        // telegram
        const TELEGRAM_BOT_TOKEN = '7786727966:AAENBDXFKdVcYAPYkKFkpEta2-UlvoyB1q0'; // Store your token in an environment variable
        const TELEGRAM_CHAT_ID = '-1002459175480'; // Store your group chat ID in an environment variable
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        const message = `
        📦 *New Product Information* 📦
        - 📇 *Customer Name:* ${customer}
        - 📞 *Phone:* ${phone}
        - 📍 *Address:* ${address}
        - =============================
        - 🆔 *Product ID:* ${productId}
        - 🏷️ *Name:* ${productName}
        - 📏 *Size:* ${selectedSize || 'N/A'}
        - 🎨 *Color:* ${selectedColor || 'N/A'}
        - 🔢 *Quantity:* ${qtyChange || 0}
        - 💵 *Price:* $${Number(productPrice).toFixed(2) || '0.00'}
        - 💵 *Total:* $${(Number(qtyChange) * Number(productPrice)).toFixed(2) || '0.00'}
        `;

        if (qtyChange === 0) {
            setAlert("Please set Quantity. Can not empty!");
            setTimeout(() => {
                setAlert("");
            }, 3000);
            return;
        }

        setBtnLoading(true);
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: message,
                    parse_mode: 'Markdown', // Enables formatting
                }),
            });

            const resAppSheet = await fetch(endPoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    applicationAccessKey: apiKey,
                },
                body: JSON.stringify({
                    Action: "Add",
                    Properties: {
                        Locale: "en-US",
                        Timezone: "UTC",
                    },
                    Rows: [
                        {
                            customer: customer,
                            phone_number: phone,
                            address: address,
                            item1: productId,
                            item1_qty: qtyChange,
                            item1_price: productPrice,
                            amount: qtyChange * productPrice,
                        },
                    ],
                }),
            });

            const data = await res.json();
            const dataAppSheet = await resAppSheet.json();
            setBtnLoading(false);
            if (res.ok) {
                setAlert("Message sent successfully!");
            } else {
                setAlert(`Error: ${data.message}`);
                setAlert(`Error: ${dataAppSheet.message}`);
            }
        } catch (error) {
            setAlert("An error occurred while sending the message.");
            console.error(error);
        } finally {
            setAlert("");
            setBtnLoading(false);
            setModalToggle(true);
            setCustomer('');
            setPhone('');
            setAddress('');
            setSelectedSize('');
            setSelectedColor('');
            setQtyChange(0);
        }
    };
    const onCloseModal = () => {
        setCustomer('');
        setPhone('');
        setAddress('');
        setSelectedSize('');
        setSelectedColor('');
        setQtyChange(0);
    }
    const handleToggle = () => {
        setModalToggle((prev) => !prev); // Toggle modal state
    };

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center overflow-hidden fixed inset-0 text-center text-gray-500 z-[50]">
                <span className="loading loading-spinner text-error"></span>
            </div>
        );
    }
    if (error) {
        return <div>Error: {error}</div>;
    }
    return (
    <div className={`w-full mx-auto max-w-screen-lg md:px-3`}>
      <Navigation
          searchParams={handleParams}
          containScroll={scrollContainerRef}
      />
        <div
            ref={scrollContainerRef}
            className="!h-[82vh] md:!h-[85vh] lg:!h-[87vh] xl:!h-[80vh] 2xl:!h-[83vh] !overflow-y-scroll scroll-smooth"
        >
            <div className="w-full  md:px-5 xl:px-0">
                <Slidder />
            </div>
            <div>
                {filteredData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-10">
                        <img
                            src={errorIcon} // Replace with your image path
                            alt="No data"
                            className="mb-6" // Any additional classes can be kept here
                        />
                        <h2 className="text-xl text-center font-semibold text-gray-700">
                            Data not exist!
                        </h2>
                        <p className="text-gray-500 mt-2 text-center">
                            Try adjusting your search or filters to find what you are
                            looking for.
                        </p>
                    </div>
                ) : (
                    category
                        ?.filter(
                            (cate) =>
                                filteredData.some((item) => item.category === cate.cate_id) // Check if any items match the category ID
                        )
                        .map((cate) => (
                            <section
                                id={`section_${cate.cate_id}`}
                                key={cate.cate_id}
                                className={`section bg-[#ededed] p-3`}
                            >
                                <header className="sticky top-0 z-20 bg-[#ececec] flex justify-center items-center gap-[5px] w-full py-2">
                                    <hr className="w-full h-[3px] bg-gray-300 rounded-full ms-1 md:ms-10" />
                                    <h1 className="text-black w-full text-center font-bold text-[16px] lg:text-[24px]">
                                        {cate.cate_name}
                                    </h1>
                                    <hr className="w-full h-[3px] bg-gray-300 rounded-full me-1 md:me-10" />
                                </header>
                                <div className="grid grid-cols-12 items-center justify-center gap-[2vw] xl:gap-[1vw]">
                                    {filteredData.map((items) =>
                                            items.category !== cate.cate_id ? null : (
                                                <button
                                                    key={items.item_id}
                                                    onClick={() => showModal(items.item_id)}
                                                    className="col-span-6 group relative block overflow-hidden rounded-lg md:rounded-xl shadow-md"
                                                >
                                                    <strong className={items.sale_price <= 0 ? "sr-only":"absolute start-2 top-2 z-10 rounded-md bg-red-500 px-2 pb-2 pt-1 text-white transition"}>
                                                        <span className="sr-only">Wishlist</span>
                                                        <b className="text-[12px]">
                                                            {(((items.sale_price - items.unit_price) / items.sale_price) * 100).toFixed(0) + "% OFF"}
                                                        </b>
                                                    </strong>
                                                    <img
                                                        src={items.image_url}
                                                        alt={items.item_name}
                                                        className="h-[16vh] md:h-[30vh] lg:h-[50vh] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-72"
                                                    />
                                                    <div className="relative border border-gray-100 bg-white p-2 md:p-6 text-start">
                                                        <p className="text-gray-400 text-[12px] md:text-[14px]">
                                                            ID:{items.item_id}
                                                        </p>
                                                        <h3 className="text-[14px] md:text-[16px] font-medium text-gray-900 truncate ...">
                                                            {items.item_name}
                                                        </h3>
                                                        <span className={items.sale_price == 0 ? 'hidden': "text-gray-400 line-through text-[14px] decoration-red-500"}>
                                  {formatCurrency(items.sale_price)}
                            </span>
                                                        <p className="text-gray-700">
                                                            {" "}
                                                            {formatCurrency(items.unit_price)}
                                                        </p>
                                                    </div>
                                                </button>
                                            )
                                    )}
                                </div>
                            </section>
                        ))
                )}
            </div>
            <footer className="py-[24px]">
                <div className="text-center text-black">
                    <h1 className="text-[16px] md:text-[24px]">Powered by</h1>
                    <img src={logo}  alt="logo" className="w-[64px] h-[64px] mx-auto"/>
                    <h1 className="text-[24px] md:text-[44px] text-[#eb1c25]">
                        168styles
                    </h1>
                </div>
            </footer>
        </div>

        {modelId &&
            data &&
            data.map((item) => {
                if (item.item_id === modelId) {
                    return (
                        <dialog
                            id={`my_modal_${modelId}`}
                            className="modal !p-0 !m-0"
                            key={item.item_id}
                        >
                            <div className="modal-box !p-0 !m-0 !relative !h-[80vh] !bg-gray-100 md:!h-[60vh] xl:!h-[76vh]">
                                <form method="dialog">
                                    <button onClick={onCloseModal} className="btn btn-xs text-red-500 btn-circle btn-ghost absolute right-2 top-2 z-[30]">
                                        ✕
                                    </button>
                                </form>
                                <div className="w-full">
                                    {item.image_display_1 === "" &&
                                    item.image_display_2 === "" &&
                                    item.image_display_3 === "" &&
                                    item.image_display_4 === "" &&
                                    item.image_display_5 === "" ? (
                                        <img
                                            src={item.image_url}
                                            alt={item.item_name}
                                            width={1760}
                                            height={2000}
                                            className="w-full h-[46vh] md:h-[40vh] xl:h-[50vh] object-cover object-center"
                                        />
                                    ) : (
                                        <Swiper
                                            pagination={{
                                                dynamicBullets: true, // Enable dynamic bullets
                                            }}
                                            modules={[Pagination]}
                                            className="mySwiper"
                                        >
                                            {item.image_url === "" ? (
                                                ""
                                            ) : (
                                                <SwiperSlide>
                                                    <img
                                                        src={item.image_url}
                                                        alt={item.item_name}
                                                        width={1760}
                                                        height={2000}
                                                        className="w-full h-[46vh] md:h-[40vh] xl:h-[50vh] object-cover object-center"
                                                    />
                                                </SwiperSlide>
                                            )}
                                            {item.image_display_1 === "" ? (
                                                ""
                                            ) : (
                                                <SwiperSlide>
                                                    <img
                                                        src={item.image_display_1}
                                                        alt={item.item_name}
                                                        width={1760}
                                                        height={2000}
                                                        className="w-full h-[46vh] md:h-[40vh] xl:h-[50vh] object-cover object-center"
                                                    />
                                                </SwiperSlide>
                                            )}
                                            {item.image_display_2 === "" ? (
                                                ""
                                            ) : (
                                                <SwiperSlide>
                                                    <img
                                                        src={item.image_display_2}
                                                        alt={item.item_name}
                                                        width={1760}
                                                        height={2000}
                                                        className="w-full h-[46vh] md:h-[40vh] xl:h-[50vh] object-cover object-center"
                                                    />
                                                </SwiperSlide>
                                            )}
                                            {item.image_display_3 === "" ? (
                                                ""
                                            ) : (
                                                <SwiperSlide>
                                                    <img
                                                        src={item.image_display_3}
                                                        alt={item.item_name}
                                                        width={1760}
                                                        height={2000}
                                                        className="w-full h-[46vh] md:h-[40vh] xl:h-[50vh] object-cover object-center"
                                                    />
                                                </SwiperSlide>
                                            )}
                                            {item.image_display_4 === "" ? (
                                                ""
                                            ) : (
                                                <SwiperSlide>
                                                    <img
                                                        src={item.image_display_4}
                                                        alt={item.item_name}
                                                        width={1760}
                                                        height={2000}
                                                        className="w-full h-[46vh] md:h-[40vh] xl:h-[50vh] object-cover object-center"
                                                    />
                                                </SwiperSlide>
                                            )}
                                            {item.image_display_5 === "" ? (
                                                ""
                                            ) : (
                                                <SwiperSlide>
                                                    <img
                                                        src={item.image_display_5}
                                                        alt={item.item_name}
                                                        width={1760}
                                                        height={2000}
                                                        className="w-full h-[46vh] md:h-[40vh] xl:h-[50vh] object-cover object-center"
                                                    />
                                                </SwiperSlide>
                                            )}
                                        </Swiper>
                                    )}
                                </div>
                                <div className="relative flex flex-col items-start justify-end bg-gray-100 p-4">
                                    <strong className={item.sale_price <= 0 ? "sr-only":"my-2 start-2 top-2 z-10 rounded-md bg-red-500/30 px-2 pb-2 pt-1 text-red-500 transition"}>
                                        <span className="sr-only">Wishlist</span>
                                        <p className="text-[12px]">
                                            {(((item.sale_price - item.unit_price) / item.sale_price) * 100).toFixed(0) + "% OFF"}
                                        </p>
                                    </strong>
                                    <div className="w-full">
                                        <div className="flex items-center gap-2">
                                            <strong className="text-[22px] font-[600] text-gray-700 uppercase">
                                                {formatCurrency(item.unit_price)}
                                            </strong>
                                            <span className={item.sale_price == 0 ? 'hidden': "text-gray-400 line-through text-[16px] decoration-red-500"}>
                          {" "}
                                                {formatCurrency(item.sale_price)}
                        </span>
                                        </div>
                                        <strong className="text-[16px] text-red-500 uppercase">
                                            ID: {item.item_id}
                                        </strong><br/>
                                        <b className="text-[16px] font-[600] text-gray-700 uppercase">
                                            {item.item_name}
                                        </b><br/>
                                        <p className="text-[14px] text-light text-gray-700 text-balance">
                                            {item.description.split("\n").map((line, index) => (
                                                <span key={index}>
                              {line}
                                                    <br />
                            </span>
                                            ))}
                                        </p><br/>
                                        <form
                                            onSubmit={handleSubmit}
                                            className="w-full overflow-hidden"
                                        >
                                            <input
                                                type="text"
                                                name="proId"
                                                value={productId}
                                                id="proId"
                                                className="hidden"
                                                onChange={(e) => setProductId(e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                name="proId"
                                                value={productName}
                                                id="proId"
                                                className="hidden"
                                                onChange={(e) => setProductName(e.target.value)}
                                            />
                                            <input
                                                type="number"
                                                name="proId"
                                                value={productPrice}
                                                id="proId"
                                                className="hidden"
                                                onChange={(e) =>
                                                    setProductPrice(Number(e.target.value))
                                                }
                                            />
                                            <div className="flex flex-col justify-start items-start gap-3 my-3">
                                                {item.size === "" ? (
                                                    ""
                                                ) : (
                                                    <fieldset className="flex flex-wrap items-center gap-3 !uppercase">
                                                        <label className="text-black">Size: </label>

                                                        {item.size.split(",").map((size, index) => {
                                                            const trimmedSize = size.trim();
                                                            const sizeId = `Size${trimmedSize.replace(
                                                                /\s+/g,
                                                                ""
                                                            )}`; // Generate unique ID

                                                            return (
                                                                <label
                                                                    key={index}
                                                                    htmlFor={sizeId}
                                                                    className="flex cursor-pointer items-center justify-center rounded-md border border-gray-100 bg-white px-2 py-1 text-gray-900 hover:border-gray-200 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-500 has-[:checked]:text-white"
                                                                >
                                                                    <input
                                                                        type="radio"
                                                                        name="sizeOption"
                                                                        value={trimmedSize}
                                                                        id={sizeId}
                                                                        className="hidden"
                                                                        checked={selectedSize === trimmedSize} // Controlled by React state
                                                                        onChange={(e) =>
                                                                            setSelectedSize(e.target.value)
                                                                        } // Update state on change
                                                                    />
                                                                    <span className="text-[14px] text-black">
                                      {trimmedSize}
                                    </span>
                                                                </label>
                                                            );
                                                        })}
                                                    </fieldset>
                                                )}
                                                {item.color === "" ? (
                                                    ""
                                                ) : (
                                                    <fieldset className="flex flex-wrap items-center gap-3">
                                                        <label className="text-black">Color: </label>

                                                        {item.color.split(",").map((color, index) => {
                                                            const trimmedColor = color.trim();
                                                            const colorId = `Color${trimmedColor.replace(
                                                                /\s+/g,
                                                                ""
                                                            )}`; // Generate unique ID

                                                            return (
                                                                <label
                                                                    key={index}
                                                                    htmlFor={colorId}
                                                                    className={`block size-5 cursor-pointer rounded-full shadow-sm has-[:checked]:ring-2 
                                        has-[:checked]:ring-${trimmedColor.toLowerCase()} 
                                        has-[:checked]:ring-offset-2`}
                                                                    style={{
                                                                        backgroundColor:
                                                                            trimmedColor.toLowerCase(),
                                                                    }}
                                                                >
                                                                    <input
                                                                        type="radio"
                                                                        name="colorOption"
                                                                        value={trimmedColor}
                                                                        id={colorId}
                                                                        className="hidden"
                                                                        checked={selectedColor === trimmedColor} // Controlled by React state
                                                                        onChange={(e) =>
                                                                            setSelectedColor(e.target.value)
                                                                        } // Update state on change
                                                                    />
                                                                    <span className="hidden">
                                      {trimmedColor}
                                    </span>
                                                                </label>
                                                            );
                                                        })}
                                                    </fieldset>
                                                )}
                                            </div>
                                            <div>
                                                <label htmlFor="qty" className="hidden">
                                                    {" "}
                                                    Quantity{" "}
                                                </label>

                                                <div className="flex justify-start items-center w-[13vh] rounded border border-gray-400 mb-3">
                                                    <button
                                                        onClick={() =>
                                                            setQtyChange((prevState) => (prevState -= 1))
                                                        }
                                                        disabled={qtyChange <= 0 ? true : false}
                                                        type="button"
                                                        className="size-10 leading-10 text-white transition hover:opacity-75"
                                                    >
                                                        <svg
                                                            className="mx-auto text-black"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="#000000"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            width="14"
                                                            height="14"
                                                            strokeWidth="1"
                                                        >
                                                            <path d="M5 12l14 0"></path>
                                                        </svg>
                                                    </button>

                                                    <input
                                                        type="number"
                                                        id="qty"
                                                        name="qty"
                                                        value={qtyChange}
                                                        onChange={(e) =>
                                                            setQtyChange(Number(e.target.value))
                                                        }
                                                        className="h-10 w-12 border-transparent text-black text-center bg-gray-200 [-moz-appearance:_textfield] sm:text-sm [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                                                    />

                                                    <button
                                                        onClick={() =>
                                                            setQtyChange((nextState) => (nextState += 1))
                                                        }
                                                        type="button"
                                                        className="size-10 leading-10 text-white transition hover:opacity-75"
                                                    >
                                                        <svg
                                                            className="mx-auto text-black"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            width="14"
                                                            height="14"
                                                            strokeWidth="1"
                                                            strokeLinejoin="round"
                                                            strokeLinecap="round"
                                                            stroke="#000000"
                                                        >
                                                            <path d="M12 5l0 14"></path>
                                                            <path d="M5 12l14 0"></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                            {alert ? (
                                                <div
                                                    role="alert"
                                                    className="rounded border-s-4 border-red-500 bg-red-50 p-2"
                                                >
                                                    <strong className="block text-[12px]  font-medium text-red-800">
                                                        {" "}
                                                        Something went wrong{" "}
                                                    </strong>

                                                    <p className=" text-[11px] text-red-700">
                                                        {alert}
                                                    </p>
                                                </div>
                                            ) : (
                                                ""
                                            )}
                                            <div className={"flex flex-col justify-center pb-4 items-center"}>
                                                <button
                                                    disabled={qtyChange === 0 }
                                                    onClick={handleToggle}
                                                    type="button"
                                                    className={qtyChange === 0 ? 'rounded-sm  ms-1 group relative inline-block text-sm font-medium focus:outline-none focus:ring-none text-red-400' : "rounded-sm  ms-1 group relative inline-block text-sm font-medium text-red-600 focus:outline-none focus:ring-none active:text-red-500"}
                                                >
                                                    <span className="absolute inset-0 border border-current rounded-sm "></span>
                                                    <span className={qtyChange === 0 ? "rounded-sm items-center gap-3 block border border-current bg-gray-200 px-8 py-2 transition-transform cursor-not-allowed group-hover:-translate-x-0 group-hover:-translate-y-0":"rounded-sm  flex items-center gap-3 block border border-current bg-white px-8 py-2 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1"}>
                                  Check out
                                </span>
                                                </button>

                                                <div   className={`${
                                                    modalToggle ? 'block' : 'hidden'
                                                } p-5 space-y-5 bg-gray-300 w-full absolute bottom-[-15%] left-0 right-0 h-[170%] z-[50] rounded-tr-xl rounded-tl-xl transition-all duration-[300ms] ease-out-in !text-black`} >
                                                    <button onClick={handleToggle} type="button" className="btn btn-xs text-red-500 btn-circle btn-ghost absolute right-2 top-2 z-[30]">
                                                        ✕
                                                    </button>

                                                    <div>
                                                        <div className="mb-2">
                                                            <span className="text-[12px] text-black">ID: <b className="text-[13px] !text-end font-[200] text-[#eb1c25]">{productId}</b> </span><br/>
                                                            <span className="text-[12px] text-black">Product Name: <b className="text-[13px] !text-end font-[200] text-[#eb1c25]">{productName}</b> </span><br/>
                                                            <span className="text-[12px] text-black">Price: <b className="text-[13px] !text-end font-[200] text-[#eb1c25]">{formatCurrency(productPrice)}</b> </span><br/>
                                                            <span className="text-[12px] text-black">Quantity: <b className="text-[13px] !text-end font-[200] text-[#eb1c25]">{qtyChange}</b> </span><br className={selectedSize === ''? 'hidden': 'block'}/>
                                                            <span className={selectedSize === '' ? 'hidden':"text-[12px] text-black"}>Size: <b className="text-[13px] !text-end font-[200] text-[#eb1c25]">{selectedSize}</b> </span><br className={selectedColor === ''? 'hidden': 'block'}/>
                                                            <span className={selectedColor === '' ? 'hidden': "text-[12px] text-black"}>Color: <b className="text-[13px] !text-end font-[200] text-[#eb1c25]">{selectedColor}</b> </span><br/>
                                                        </div>
                                                        <hr className="text-white py-1"/>
                                                        <strong>
                                                            <p className="text-[#eb1c25] font-bold mt-2">
                                      <span className="font-light text-black">
                                        Total: {" "}
                                      </span>
                                                                {formatCurrency(productPrice * qtyChange)}
                                                            </p>
                                                        </strong>
                                                    </div>

                                                    <div>
                                                        <label className="sr-only" htmlFor="name">Name</label>
                                                        <input
                                                            className="w-full text-gray-200 rounded-lg outline-none p-3 text-sm"
                                                            placeholder="Name"
                                                            type="text"
                                                            id="name"
                                                            name="name"
                                                            value={customer}
                                                            onChange={(e)=>setCustomer(e.target.value)}
                                                            required
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="sr-only" htmlFor="phone">Phone</label>
                                                        <input
                                                            className="w-full text-gray-200 rounded-lg outline-none p-3 text-sm"
                                                            placeholder="Phone Number"
                                                            type="tel"
                                                            id="phone"
                                                            value={phone}
                                                            onChange={(e)=>setPhone(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="sr-only" htmlFor="address">Email</label>
                                                        <textarea
                                                            className="text-gray-200 w-full rounded-lg outline-none p-3 text-sm"
                                                            placeholder="Address"
                                                            id="address"
                                                            name="address"
                                                            value={address}
                                                            onChange={(e)=>setAddress(e.target.value)}
                                                            required
                                                        ></textarea>
                                                    </div>

                                                    <button
                                                        type="submit"
                                                        disabled={!btnLoading}
                                                        className="group relative inline-block text-sm font-medium text-red-600 focus:outline-none focus:ring-none active:text-red-500"
                                                    >
                                                        <span className="absolute inset-0 border border-current"></span>
                                                        <span className="flex items-center gap-3 block border border-current bg-white px-6 py-1 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1">
                                                              {!btnLoading ? <div className="flex gap-2 items-center"><span className="loading loading-spinner text-success"></span> <p>loading...</p></div> :<p>Order Now</p>}
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className="relative flex items-center justify-center gap-3 pb-3">
                                    <Link to='#'>
                                        <img
                                            src={facebook}
                                            alt="kh-flag"
                                            width="3000"
                                            height="2000"
                                            className="w-[24px] h-[24px] rounded-[4px]"
                                        />
                                    </Link>
                                    <Link to='#'>
                                        <img
                                            src={telegram}
                                            alt="kh-flag"
                                            width="3000"
                                            height="2000"
                                            className="w-[24px] h-[24px] rounded-[4px]"
                                        />
                                    </Link>
                                    <Link to='#'>
                                        <img
                                            src={google}
                                            alt="kh-flag"
                                            width="3000"
                                            height="2000"
                                            className="w-[24px] h-[24px] rounded-[4px]"
                                        />
                                    </Link>
                                    <Link to='#'className="flex gap-3 text-black">
                                        <img
                                            src={telephone}
                                            alt="kh-flag"
                                            width="3000"
                                            height="2000"
                                            className="w-[24px] h-[24px] rounded-[4px]"
                                        />
                                        012 123 123
                                    </Link>
                                </div>
                            </div>
                        </dialog>
                    )
                }
                return null;
            })}

    </div>
  )
}

export default Home

