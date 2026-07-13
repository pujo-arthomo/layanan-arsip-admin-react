function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-4">
      <h1 className="text-2xl font-bold text-[#1B4B3A]">{title}</h1>

      {subtitle && (
        <p className="text-sm text-[#5C6B63] mt-1">{subtitle}</p>
      )}
    </div>
  );
}

export default PageHeader;