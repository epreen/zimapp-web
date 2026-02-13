import NewsletterForm from "../forms/newsletter-form"

const NewsletterSection = () => {
  return (
    <div>
        <h3 className="font-semibold mb-4">
            Newsletter
        </h3>
        <p className="text-sm mb-4 text-foreground/60">
            Subscribe to our newsletter to receive updates and exclusive offers.
        </p>
        <NewsletterForm />
    </div>
  )
}

export default NewsletterSection