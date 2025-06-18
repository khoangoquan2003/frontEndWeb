"use client"

import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"

import {
    BookOpen,
    MessageCircle,
    Headphones,
    Youtube,
    GraduationCap,
    School,
    SpellCheckIcon as Spellcheck,
    Calculator,
    Play,
    Star,
    Users,
    Award,
    ChevronRight,
    Globe,
    Volume2,
} from "lucide-react"
import { toast } from "react-toastify"

const HomePage = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [nickname, setNickname] = useState("")

    useEffect(() => {
        if (location.state?.loginSuccess) {
            toast.success("🎉 Đăng nhập thành công!", {
                position: "top-right",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
            navigate(location.pathname, { replace: true })
        }
    }, [location, navigate])

    useEffect(() => {
        const name = localStorage.getItem("nickname")
        if (name) setNickname(name)
    }, [])

    const handleLogout = () => {
        localStorage.clear()
        toast.info("👋 Bạn đã đăng xuất", {
            position: "top-right",
            autoClose: 2000,
        })
        setTimeout(() => {
            navigate("/login")
        }, 1000)
    }

    const practiceCategories = [
        {
            title: "Short Stories",
            description:
                "A collection of audio articles introducing culture, people, places, historical events and daily life in English-speaking countries.",
            icon: BookOpen,
            topics: ["First snowfall", "Jessica's first day of school", "My flower garden", "Going camping", "My house"],
            link: "/short-stories",
            color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
            iconColor: "text-blue-600",
        },
        {
            title: "Daily Conversations",
            description: "Short and fun English conversations in common situations you may experience in daily life.",
            icon: MessageCircle,
            topics: ["At home (1)", "At home (2)", "My Favorite Photographs (1)", "Location", "Location (2)"],
            link: "/daily-conversations",
            color: "bg-green-50 border-green-200 hover:bg-green-100",
            iconColor: "text-green-600",
        },
        {
            title: "TOEIC Listening",
            description:
                "Conversations and short talks in everyday life and at work. Let's improve your English communication skills!",
            icon: Headphones,
            topics: ["Conversation 1 - 4", "Short Talk 1 - 4"],
            link: "/toeic-listening",
            color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
            iconColor: "text-purple-600",
        },
        {
            title: "YouTube",
            description: "Learn real English from YouTube videos that native speakers watch and enjoy!",
            icon: Youtube,
            topics: ["The Egg", "The Art of Balancing Stones", "Why Boredom is Good For You", "Wolf Pack Hunts A Hare"],
            link: "/youtube",
            color: "bg-red-50 border-red-200 hover:bg-red-100",
            iconColor: "text-red-600",
        },
        {
            title: "IELTS Listening",
            description: "Practice with everyday conversations & academic talks in British and Australian accents.",
            icon: GraduationCap,
            topics: ["CAM 19 - Test 1 - Part 1–4", "CAM 19 - Test 2 - Part 1–4"],
            link: "/ielts-listening",
            color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
            iconColor: "text-orange-600",
        },
        {
            title: "TOEFL Listening",
            description: "Academic conversations & lectures in American English to help you prepare for studying abroad.",
            icon: School,
            topics: ["Conversation 1–4", "Lecture 1–4"],
            link: "/toefl-listening",
            color: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100",
            iconColor: "text-indigo-600",
        },
        {
            title: "Spelling Names",
            description: "Learn the English alphabet by spelling common English names and animals.",
            icon: Spellcheck,
            topics: ["Female Names", "Male Names", "Last Names", "Animal Names"],
            link: "/spelling-names",
            color: "bg-pink-50 border-pink-200 hover:bg-pink-100",
            iconColor: "text-pink-600",
        },
        {
            title: "Numbers",
            description: "Practice understanding English numbers spoken quickly in American accents.",
            icon: Calculator,
            topics: ["Phone numbers", "Numbers (1–4)"],
            link: "/numbers",
            color: "bg-teal-50 border-teal-200 hover:bg-teal-100",
            iconColor: "text-teal-600",
        },
    ]

    const faqs = [
        {
            question: "Is this program free?",
            answer: "Yes, it's 100% FREE!",
        },
        {
            question: "Is this website for beginners?",
            answer:
                "As long as you can understand this page, you're good to go! But it's better if you know basic English pronunciation.",
        },
        {
            question: "How long will it take to become fluent with this website?",
            answer:
                "It depends on many things (such as your current level, how many hours you will spend each day). I can only say that your English will improve very quickly with this method.",
        },
        {
            question: "Will my speaking skills improve using this method?",
            answer:
                "Speaking and listening skills are related together, once you have better listening skills, it's much easier and faster to improve your speaking skills.",
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md shadow-sm border-b">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Globe className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Học Tiếng Anh
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        {nickname ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-700 font-medium">👋 Xin chào, {nickname}!</span>
                                <Button
                                    variant="ghost"
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={handleLogout}
                                >
                                    Đăng xuất
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Button variant="ghost" asChild>
                                    <Link to="/login">Đăng nhập</Link>
                                </Button>
                                <Button asChild>
                                    <Link to="/register">Đăng ký</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800"></div>
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative container mx-auto px-4 py-24 text-center text-white">
                    <div className="max-w-4xl mx-auto">
                        <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
                            <Volume2 className="w-4 h-4 mr-2" />
                            Phương pháp học hiện đại
                        </Badge>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                            Luyện tập tiếng Anh mỗi ngày với
                            <span className="block text-yellow-300">bài tập nghe - chép chính tả</span>
                        </h1>
                        <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
                            Cách nhanh nhất để nâng cao kỹ năng nghe và phát âm của bạn với phương pháp được chứng minh hiệu quả!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button
                                size="lg"
                                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 text-lg"
                                asChild
                            >
                                <Link to="/topics">
                                    <Play className="w-5 h-5 mr-2" />
                                    Bắt đầu ngay
                                </Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg"
                            >
                                Tìm hiểu thêm
                                <ChevronRight className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute bottom-20 right-10 w-32 h-32 bg-yellow-300/20 rounded-full blur-xl"></div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <Users className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-2">10,000+</h3>
                            <p className="text-gray-600">Học viên đã tham gia</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <Award className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-2">95%</h3>
                            <p className="text-gray-600">Tỷ lệ cải thiện kỹ năng</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                                <Star className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-2">4.9/5</h3>
                            <p className="text-gray-600">Đánh giá từ học viên</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-6 text-gray-900">Tại sao nên luyện nghe - chép chính tả?</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
                        Khi luyện tập trên trang web này, bạn sẽ được tiếp cận với phương pháp học nghe hiện đại, giúp bạn cải thiện
                        kỹ năng nghe, phát âm, chính tả và từ vựng một cách toàn diện.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: Headphones, title: "Cải thiện kỹ năng nghe", desc: "Luyện nghe với nhiều giọng điệu khác nhau" },
                            { icon: Volume2, title: "Phát âm chuẩn", desc: "Học phát âm từ người bản xứ" },
                            { icon: Spellcheck, title: "Chính tả chính xác", desc: "Rèn luyện khả năng viết đúng chính tả" },
                            { icon: BookOpen, title: "Mở rộng từ vựng", desc: "Học từ vựng trong ngữ cảnh thực tế" },
                        ].map((benefit, index) => (
                            <Card
                                key={index}
                                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <CardContent className="p-6 text-center">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                                        <benefit.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                                    <p className="text-sm text-gray-600">{benefit.desc}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Practice Categories */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4 text-gray-900">Các chủ đề luyện nghe</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Khám phá đa dạng chủ đề từ cơ bản đến nâng cao, phù hợp với mọi trình độ
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {practiceCategories.map((category, index) => (
                            <Card
                                key={index}
                                className={`${category.color} border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group`}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <category.icon className={`w-8 h-8 ${category.iconColor}`} />
                                        <Badge variant="secondary" className="text-xs">
                                            {category.topics.length} bài
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {category.title}
                                    </CardTitle>
                                    <CardDescription className="text-sm text-gray-600 line-clamp-3">
                                        {category.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="space-y-1 mb-4">
                                        {category.topics.slice(0, 3).map((topic, topicIndex) => (
                                            <div key={topicIndex} className="text-xs text-gray-500 flex items-center">
                                                <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                                                {topic}
                                            </div>
                                        ))}
                                        {category.topics.length > 3 && (
                                            <div className="text-xs text-gray-400">+{category.topics.length - 3} more...</div>
                                        )}
                                    </div>
                                    <Button
                                        className="w-full group-hover:bg-blue-600 group-hover:text-white transition-all"
                                        variant="outline"
                                        size="sm"
                                        asChild
                                    >
                                        <Link to={category.link}>
                                            Bắt đầu học
                                            <ChevronRight className="w-4 h-4 ml-1" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Frequently Asked Questions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {faqs.map((faq, index) => (
                            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <h4 className="font-semibold text-lg mb-3 text-gray-900">{faq.question}</h4>
                                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-6">Sẵn sàng cải thiện kỹ năng tiếng Anh của bạn?</h2>
                    <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
                        Tham gia cùng hàng nghìn học viên đã thành công với phương pháp của chúng tôi
                    </p>
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 text-lg" asChild>
                        <Link to="/topics">
                            <Play className="w-5 h-5 mr-2" />
                            Bắt đầu học ngay
                        </Link>
                    </Button>
                </div>
            </section>


        </div>
    )
}

export default HomePage
