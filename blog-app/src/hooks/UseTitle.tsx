import { useEffect } from "react";

export default function UseTitle(title: string) {
    useEffect(() => {
        document.title = title;
    }, [])
}
