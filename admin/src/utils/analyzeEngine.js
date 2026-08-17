// utils/analysisEngine.js
export const analyzeExamData = (detailedAnalysis) => {
    const stats = detailedAnalysis.reduce((acc, q) => {
        const cat = q.category || "General";
        if (!acc[cat]) {
            acc[cat] = { total: 0, wrong: 0, time: 0, tags: new Set(), questions: [] };
        }
        acc[cat].total++;
        acc[cat].time += q.timeSpent;
        if (q.status === 'wrong') {
            acc[cat].wrong++;
            q.tags?.forEach(tag => acc[cat].tags.add(tag));
            acc[cat].questions.push(q);
        }
        return acc;
    }, {});

    const timeWasters = detailedAnalysis.filter(q => q.timeSpent > 45 && q.status === 'wrong');
    const accuracy = detailedAnalysis.length > 0 
        ? (detailedAnalysis.filter(q => q.status === 'correct').length / detailedAnalysis.length) * 100 
        : 0;

    return { stats, timeWasters, accuracy };
};