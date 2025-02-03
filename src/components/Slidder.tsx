import {useEffect,useState} from 'react'
import 'keen-slider/keen-slider.min.css'
import { useKeenSlider, KeenSliderInstance, KeenSliderOptions } from "keen-slider/react"
import "./Slidder.css"

interface Business {
    name:string;
    image_url:string;
}

export default function Slidder() {
    const [details, setDetails] = useState<KeenSliderInstance["track"]["details"] | null>(null)
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<Business[] | null>(null);
    useEffect(() => {
        const fetchCateData = async () => {
            const apiKey = 'V2-nszI0-qG9ij-Z04yR-gbemX-K9Zze-TgVdE-JX73e-imyux';
            const tableName = "business";
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

                const result: Business[] = await response.json();
                setData(result);
            }catch (err){
                setError((err as Error).message)
            }finally{
                setIsLoading(false);
            }
        }

        fetchCateData();
    }, []);

    const [sliderRef,sliderInstance] = useKeenSlider<HTMLDivElement>({
        loop: true, initial: 2,
        detailsChanged(s) {
            setDetails(s.track.details)
        },
    } as KeenSliderOptions)

    useEffect(() => {
        const interval = setInterval(() => {
            sliderInstance.current?.next(); // Automatically navigate to the next slide
        }, 5000); // Change slide every 3 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [sliderInstance]);

    const scaleStyle = (idx: number) => {
        if (!details) return {}
        const slide = details.slides[idx]
        const scaleSize = 0.7
        const scale = 1 - (scaleSize - scaleSize * slide.portion)
        return {
            transform: `scale(${scale})`,
            WebkitTransform: `scale(${scale})`,
        }
    }
    if (isLoading) {
        return <div className="flex flex-col justify-center items-center overflow-hidden fixed inset-0 text-center text-gray-500 z-[50]">
            <span className="loading loading-spinner text-error"></span>
        </div>;
    }
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div ref={sliderRef} className="keen-slider my-3 zoom-out">
            {data && data.map((images, idx) => (
                <div key={idx} className="keen-slider__slide zoom-out_slide">
                    <div style={scaleStyle(idx)}>
                        <img
                            src={images.image_url}
                            width={1760} height={2000}
                            alt={images.name}
                            className="rounded-xl w-full h-[200px] md:h-[400px] object-cover"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}