"use client"

import { useState, useEffect } from "react"
import { FaPlay, FaBookOpen, FaTrophy, FaUsers, FaChevronLeft, FaChevronRight } from "react-icons/fa"

// Banner data - có thể thay thế bằng props hoặc API
const bannerData = [
    {
        id: 1,
        title: "Học Tiếng Anh Hiệu Quả",
        subtitle: "Phương pháp học tập hiện đại với AI",
        description: "Khám phá cách học tiếng Anh thông minh với công nghệ trí tuệ nhân tạo",
        buttonText: "Bắt đầu học",
        backgroundImage: "/placeholder.svg?height=400&width=800",
        gradient: "from-blue-600 to-purple-700",
        icon: <FaBookOpen className="text-4xl" />,
    },
    {
        id: 2,
        title: "Thành Tích Xuất Sắc",
        subtitle: "Hơn 10,000 học viên tin tưởng",
        description: "Tham gia cộng đồng học tập năng động và đạt được mục tiêu của bạn",
        buttonText: "Xem thành tích",
        backgroundImage: "/placeholder.svg?height=400&width=800",
        gradient: "from-green-600 to-teal-700",
        icon: <FaTrophy className="text-4xl" />,
    },
    {
        id: 3,
        title: "Cộng Đồng Học Tập",
        subtitle: "Kết nối và chia sẻ kinh nghiệm",
        description: "Tham gia thảo luận, chia sẻ kinh nghiệm và học hỏi từ cộng đồng",
        buttonText: "Tham gia ngay",
        backgroundImage: "/placeholder.svg?height=400&width=800",
        gradient: "from-orange-600 to-red-700",
        icon: <FaUsers className="text-4xl" />,
    },
]

const BannerImage = () => {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)

    // Auto-slide functionality
    useEffect(() => {
        if (!isAutoPlaying) return

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % bannerData.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [isAutoPlaying])

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % bannerData.length)
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + bannerData.length) % bannerData.length)
    }

    const goToSlide = (index: number) => {
        setCurrentSlide(index)
    }

    const currentBanner = bannerData[currentSlide]

    return (
        <div className="w-full flex justify-center mt-10 mb-8">
            <div className="w-[90%] max-w-6xl relative">
                {/* Main Banner Container */}
                <div
                    className="relative h-[200px] md:h-[300px] lg:h-[400px] overflow-hidden rounded-2xl shadow-2xl group"
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}
                >
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0">
                        <img
                            src={currentBanner.backgroundImage || "/placeholder.svg"}
                            alt={currentBanner.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-r ${currentBanner.gradient} opacity-85`} />

                        {/* Animated Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full animate-pulse" />
                            <div className="absolute top-20 right-20 w-16 h-16 border-2 border-white rounded-full animate-bounce" />
                            <div className="absolute bottom-20 left-20 w-12 h-12 border-2 border-white rounded-full animate-ping" />
                            <div className="absolute bottom-10 right-10 w-24 h-24 border-2 border-white rounded-full animate-pulse" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 h-full flex items-center">
                        <div className="container mx-auto px-6 md:px-12">
                            <div className="flex flex-col md:flex-row items-center justify-between">
                                {/* Text Content */}
                                <div className="text-white md:w-2/3 text-center md:text-left">
                                    {/* Icon */}
                                    <div className="mb-4 flex justify-center md:justify-start">
                                        <div className="bg-white bg-opacity-20 p-4 rounded-full backdrop-blur-sm">{currentBanner.icon}</div>
                                    </div>

                                    {/* Title */}
                                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 leading-tight">
                                        {currentBanner.title}
                                    </h1>

                                    {/* Subtitle */}
                                    <h2 className="text-lg md:text-xl lg:text-2xl font-medium mb-2 md:mb-4 opacity-90">
                                        {currentBanner.subtitle}
                                    </h2>

                                    {/* Description */}
                                    <p className="text-sm md:text-base lg:text-lg mb-4 md:mb-6 opacity-80 max-w-2xl">
                                        {currentBanner.description}
                                    </p>

                                    {/* CTA Button */}
                                    <button className="bg-white text-gray-800 px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold text-sm md:text-base hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center gap-2 mx-auto md:mx-0">
                                        <FaPlay className="text-sm" />
                                        {currentBanner.buttonText}
                                    </button>
                                </div>

                                {/* Decorative Element */}
                                <div className="hidden md:block md:w-1/3">
                                    <div className="relative">
                                        <div className="w-48 h-48 lg:w-64 lg:h-64 bg-white bg-opacity-10 rounded-full backdrop-blur-sm flex items-center justify-center">
                                            <div className="text-6xl lg:text-8xl text-white opacity-50">{currentBanner.icon}</div>
                                        </div>

                                        {/* Floating Elements */}
                                        <div className="absolute -top-4 -right-4 w-8 h-8 bg-white bg-opacity-20 rounded-full animate-bounce" />
                                        <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-white bg-opacity-20 rounded-full animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100"
                    >
                        <FaChevronLeft />
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100"
                    >
                        <FaChevronRight />
                    </button>
                </div>

                {/* Slide Indicators */}
                <div className="flex justify-center mt-6 space-x-2">
                    {bannerData.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                index === currentSlide ? "bg-blue-600 w-8" : "bg-gray-300 hover:bg-gray-400"
                            }`}
                        />
                    ))}
                </div>

                {/* Stats Bar */}
                <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div className="flex flex-col items-center">
                            <div className="bg-blue-100 p-3 rounded-full mb-2">
                                <FaBookOpen className="text-blue-600 text-xl" />
                            </div>
                            <div className="text-2xl font-bold text-gray-800">500+</div>
                            <div className="text-gray-600 text-sm">Bài học</div>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="bg-green-100 p-3 rounded-full mb-2">
                                <FaUsers className="text-green-600 text-xl" />
                            </div>
                            <div className="text-2xl font-bold text-gray-800">10K+</div>
                            <div className="text-gray-600 text-sm">Học viên</div>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="bg-orange-100 p-3 rounded-full mb-2">
                                <FaTrophy className="text-orange-600 text-xl" />
                            </div>
                            <div className="text-2xl font-bold text-gray-800">95%</div>
                            <div className="text-gray-600 text-sm">Hài lòng</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BannerImage
