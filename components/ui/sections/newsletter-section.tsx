import Title from "@/components/ui/title";
import Newsletter from "@/components/ui/forms/newsletter-form";

const NewsletterSection = () => {
    return (
        <div className='flex flex-col items-center px-4 my-36 mx-auto max-w-md w-full'>
            <Title
                title="Join Newsletter"
                description="Subscribe to get exclusive deals, new arrivals, and insider updates delivered straight to your inbox every week."
                visibleButton={false}
            />

            <Newsletter />
        </div>
    )
}

export default NewsletterSection