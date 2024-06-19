// TODO: get user info, post info (title/description)
export default function Post({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image: string;
}) {
  return (
    <div>
      <div className="flex items-center space-x-4">
        <img
          src="/images/edm.jpg"
          className="h-12 w-12 rounded-full bg-gray-200"
        />
        <div className="space-y-2">
          <h1 className="font-semibold">{title}</h1>
          <h2>{description}</h2>
        </div>
      </div>
      <div className="mt-4">
        <img src={image} className="object-contain rounded-2xl" />
      </div>
    </div>
  );
}
