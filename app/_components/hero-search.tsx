"use client";

import { useState } from "react";
import UrlInputForm from "./url-input-form";
import SearchExamples from "./search-examples";

export default function HeroSearch() {
    const [url, setUrl] = useState("");

    return (
        <div className="flex flex-col gap-3">
            <UrlInputForm value={url} onValueChange={setUrl} />
            <SearchExamples onSelect={setUrl} />
        </div>
    );
}
