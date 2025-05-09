const BannerImage = () => {
    return (
        <div className="w-full flex justify-center" style={{ marginTop: "40px" }}>
            <div className="w-[80%] h-[150px] overflow-hidden rounded-lg shadow">
                <img
                    src="/imgs/banner.webp"
                    alt="Banner"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
};

export default BannerImage;
