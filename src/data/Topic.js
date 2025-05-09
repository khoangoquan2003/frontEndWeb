const topics = [
    {
        id: 1,
        title: "Short Stories",
        image: "https://example.com/story.png",
        levels: "A1-C1",
        lessonCount: 289,
        sections: [
            { name: "Section 1", count: 20, lessons: ["Story 1", "Story 2"] },
            { name: "Section 2", count: 20, lessons: ["Story 3", "Story 4"] },
            // ...
        ]
    },
    {
        id: 2,
        title: "TOEIC Listening",
        image: "https://example.com/toeic.png",
        levels: "A2-C1",
        lessonCount: 600,
        sections: [
            { name: "Section 1", count: 20, lessons: ["Part 1", "Part 2"] },
            // ...
        ]
    }
];

export default topics;
