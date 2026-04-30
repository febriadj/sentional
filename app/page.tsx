import UrlInputForm from "./_components/url-input-form";
import SearchExamples from "./_components/search-examples";
import FeatureHighlights from "./_components/feature-highlights";

export default function Home() {
    return (
        <div className="bg-background flex flex-1 flex-col">
            <main className="flex flex-1 flex-col items-center justify-center px-6 py-20">
                <div className="w-full max-w-2xl">
                    {/* Hero */}
                    <div className="mb-10 flex flex-col items-center gap-5 text-center sm:items-start sm:text-left">
                        <div className="border-border/50 bg-muted/50 inline-flex items-center gap-2 rounded-full border px-3 py-1">
                            <span className="text-muted-foreground text-xs font-medium">
                                Twitter · X
                            </span>
                            <span className="bg-border h-3 w-px" />
                            <span className="text-muted-foreground/60 text-xs">
                                Account Intelligence
                            </span>
                        </div>

                        <h1 className="text-foreground text-4xl font-semibold tracking-tight sm:text-5xl">
                            Understand any account.{" "}
                            <span className="text-muted-foreground">
                                Deeply with AI.
                            </span>
                        </h1>

                        <p className="text-muted-foreground max-w-lg text-base leading-relaxed">
                            Enter a Twitter&nbsp;/&nbsp;X account URL to analyze
                            sentiment patterns, activity trends, and the topics
                            driving the conversation.
                        </p>
                    </div>

                    {/* Search */}
                    <div className="mb-4 flex flex-col gap-3">
                        <UrlInputForm />
                        <SearchExamples />
                    </div>

                    {/* Divider */}
                    <div className="bg-border/40 my-12 h-px w-full" />
                </div>
                <div className="w-full max-w-5xl px-6">
                    {/* Feature highlights */}
                    <FeatureHighlights />
                </div>
            </main>
        </div>
    );
}
