const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div
      className="hidden lg:flex items-center justify-center p-12 relative bg-no-repeat bg-center"
      style={{
        backgroundImage: "url(/auth-bg.jpg)",
        backgroundSize: "180%", // 👈 controls image size
      }}
    >
      {/* dark overlay so grid & text are clear */}
      <div className="absolute inset-0 bg-base-300/90"></div>

      {/* content */}
      <div className="relative max-w-md text-center">
        <div className="grid grid-cols-10 gap-3 mb-10">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl bg-primary/20 ${
                i % 2 === 0 ? "animate-pulse" : ""
              }`}
            />
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
