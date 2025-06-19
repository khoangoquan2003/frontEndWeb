"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

const TopicForm = ({ addTopic }) => {
    const [topicType, setTopicType] = useState("")
    const [level, setLevel] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    const [countTopic, setCountTopic] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        if (topicType && level && imageUrl && countTopic) {
            const newTopic = {
                id: Date.now(), // Generate ID for new topic
                type: topicType,
                level,
                img: imageUrl,
                countTopic: Number.parseInt(countTopic),
            }
            addTopic(newTopic) // Add topic to the list
            resetForm()
        } else {
            alert("Please fill in all information.")
        }
    }

    const resetForm = () => {
        setTopicType("")
        setLevel("")
        setImageUrl("")
        setCountTopic("")
    }

    return (
        <Card className="w-full max-w-lg p-6 rounded-xl shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl font-bold mb-4 text-teal-700 text-center">Add New Topic</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="topicType" className="block text-teal-600 font-medium mb-1">
                            Topic Name:
                        </Label>
                        <Input
                            type="text"
                            id="topicType"
                            value={topicType}
                            onChange={(e) => setTopicType(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="level" className="block text-teal-600 font-medium mb-1">
                            Level:
                        </Label>
                        <Input
                            type="text"
                            id="level"
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="imageUrl" className="block text-teal-600 font-medium mb-1">
                            Image URL:
                        </Label>
                        <Input
                            type="text"
                            id="imageUrl"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="countTopic" className="block text-teal-600 font-medium mb-1">
                            Number of Lessons:
                        </Label>
                        <Input
                            type="number"
                            id="countTopic"
                            value={countTopic}
                            onChange={(e) => setCountTopic(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200 shadow-md"
                    >
                        Add Topic
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

export default TopicForm
