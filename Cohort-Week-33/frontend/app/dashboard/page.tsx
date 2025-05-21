"use client"
import { Appbar } from "@/components/Appbar";
import { DarkButton } from "@/components/buttons/DarkButton";
import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL, HOOKS_URL } from "../config";
import { LinkButton } from "@/components/buttons/LinkButton";
import { useRouter } from "next/navigation";

interface Zap {
    "id": string,
    "triggerId": string,
    "userId": number,
    "actions": {
        "id": string,
        "zapId": string,
        "actionId": string,
        "sortingOrder": number,
        "type": {
            "id": string,
            "name": string
            "image": string
        }
    }[],
    "trigger": {
        "id": string,
        "zapId": string,
        "triggerId": string,
        "type": {
            "id": string,
            "name": string,
            "image": string
        }
    }
}

function useZaps() {
    const [loading, setLoading] = useState(true);
    const [zaps, setZaps] = useState<Zap[]>([]);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/zap`, {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        })
            .then(res => {
                setZaps(res.data.zaps);
                setLoading(false)
            })
    }, []);

    return {
        loading, zaps
    }
}

export default function () {
    const { loading, zaps } = useZaps();
    const router = useRouter();

    return <div>
        <Appbar />
        <div className="flex justify-center pt-8">
            <div className="max-w-screen-lg	 w-full">
                <div className="flex justify-between pr-8 ">
                    <div className="text-2xl font-bold">
                        My Zaps
                    </div>
                    <DarkButton onClick={() => {
                        router.push("/zap/create");
                    }}>Create</DarkButton>
                </div>
            </div>
        </div>
        {loading ? "Loading..." : <div className="flex justify-center"> <ZapTable zaps={zaps} /> </div>}
    </div>
}

function ZapTable({ zaps }: { zaps: Zap[] }) {
    const router = useRouter();

    return (
        <div className="p-8 max-w-screen-lg w-full">
            {/* Table Header */}
            <div className="grid grid-cols-[120px_220px_150px_1fr_40px] font-semibold border-b pb-2">
                <div className="text-left">Name</div>
                <div className="text-left">ID</div>
                <div className="text-left">Created at</div>
                <div className="text-left">Webhook URL</div>
                <div className="text-left">Go</div>
            </div>

            {/* Table Rows */}
            {zaps.map(z => (
                <div
                    key={z.id}
                    className="grid grid-cols-[120px_220px_150px_1fr_40px] items-center border-b py-4"
                >
                    {/* Icons with fixed width box */}
                    <div className="w-[120px]">
                        <div className="flex gap-1">
                            <img src={z.trigger.type.image} alt="Trigger" className="w-6 h-6" />
                            {z.actions.map((x, i) => (
                                <img
                                    key={x.id ?? i}
                                    src={x.type.image}
                                    alt="Action"
                                    className="w-6 h-6"
                                />
                            ))}
                        </div>
                    </div>

                    {/* ID */}
                    <div className="break-words">{z.id}</div>

                    {/* Created At */}
                    <div>Nov 13, 2023</div>

                    {/* Webhook URL */}
                    <div className="break-words text-blue-600">
                        {`${HOOKS_URL}/hooks/catch/1/${z.id}`}
                    </div>

                    {/* Go button */}
                    <div className="w-[40px] text-center">
                        <LinkButton onClick={() => router.push("/zap/" + z.id)}>Go</LinkButton>
                    </div>
                </div>
            ))}
        </div>
    );
}
