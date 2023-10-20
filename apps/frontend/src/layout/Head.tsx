import { Helmet } from "react-helmet-async";

interface HeadProps {
  title: string;
  description: string;
  name?: string;
}

const Head = ({ title, description, name }: HeadProps) => {
  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {/* End standard metadata tags */}
      {/* Facebook tags */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {/* End Facebook tags */}
      {/* Twitter tags */}
      {name ? <meta name="twitter:creator" content={name} /> : null}
      {/*“summary”, “summary_large_image”, “app”, or “player”.*/}
      <meta name="twitter:card" content={"summary"} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {/* End Twitter tags */}
    </Helmet>
  );
};

export default Head;
