"use client"

import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { FolderOpen, Layers, Trash2, Plus, Loader2 } from "lucide-react"

export default function SectionsTab({
                                        sections,
                                        loadingSections,
                                        courseCounts,
                                        selectedSection,
                                        submittingSection,
                                        onSelectSection,
                                        onCreateSection,
                                        onDeleteSection,
                                    }) {
    if (loadingSections) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                <span className="ml-2">Đang tải sections...</span>
            </div>
        )
    }

    if (sections.length === 0) {
        return (
            <>
                <Card>
                    <CardContent className="p-8 text-center">
                        <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Không có section nào cho topic này.</p>
                    </CardContent>
                </Card>
                <Button
                    onClick={onCreateSection}
                    disabled={submittingSection}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 mt-4"
                >
                    {submittingSection ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Đang tạo...
                        </>
                    ) : (
                        <>
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm Section mới
                        </>
                    )}
                </Button>
            </>
        )
    }

    return (
        <div className="space-y-4">
            <div className="space-y-3">
                {sections.map((section) => (
                    <Card
                        key={section.id}
                        className={`cursor-pointer transition-all duration-200 ${
                            selectedSection?.id === section.id ? "ring-2 ring-blue-500 bg-blue-50" : "hover:shadow-md"
                        }`}
                        onClick={() => onSelectSection(section)}
                    >
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Layers className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{section.name}</h4>
                                        <p className="text-sm text-gray-500">{courseCounts[section.id] ?? "..."} khóa học</p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => onDeleteSection(e, section.id)}
                                    className="hover:bg-red-50 hover:border-red-300 hover:text-red-700"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Button
                onClick={onCreateSection}
                disabled={submittingSection}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
                {submittingSection ? (
                    <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Đang tạo...
                    </>
                ) : (
                    <>
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm Section mới
                    </>
                )}
            </Button>
        </div>
    )
}
