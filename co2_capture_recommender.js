const amineDescriptions = {
    MEA:  "빠른 반응속도와 낮은 비용으로 인해 발전소 등 대규모 배출원에 적합합니다.",
    DEA:  "균형 잡힌 성능과 효율로 다목적 산업에 사용하기 적합합니다.",
    MDEA: "낮은 부식성과 재생 에너지 소비로 정밀 화학 공정이나 장비 수명이 중요한 곳에 적합합니다.",
    AMP:  "흡수 효율이 높아 고순도 CO₂가 필요한 공정에 적합합니다."
};

const amineData = {
    MEA:    { 효율: 0.74, 속도: 1.0, 에너지: 0.30, 부식: 0.40, 환경: 0.80, 경제: 1.00 },
    DEA:    { 효율: 0.89, 속도: 0.7, 에너지: 0.52, 부식: 0.55, 환경: 0.70, 경제: 0.90 },
    MDEA:   { 효율: 0.67, 속도: 0.4, 에너지: 1.00, 부식: 1.00, 환경: 0.60, 경제: 0.80 },
    AMP:    { 효율: 1.00, 속도: 0.6, 에너지: 0.71, 부식: 0.65, 환경: 0.50, 경제: 0.70 }
};

function calculateRecommendation() {
    try {
        const weights = {
            효율: parseInt(document.querySelector('input[name="efficiency"]:checked').value),
            속도: parseInt(document.querySelector('input[name="speed"]:checked').value),
            에너지: parseInt(document.querySelector('input[name="energy"]:checked').value),
            부식: parseInt(document.querySelector('input[name="corrosion"]:checked').value),
            환경: parseInt(document.querySelector('input[name="environment"]:checked').value),
            경제: parseInt(document.querySelector('input[name="economy"]:checked').value)
        };

        const scores = {
            MEA: 0,
            DEA: 0,
            MDEA: 0,
            AMP: 0
        };

        // Calculate scores for each amine
        for (let amine in amineData) {
            const data = amineData[amine];
            scores[amine] = (
                data.효율 * weights.효율 +
                data.속도 * weights.속도 +
                data.에너지 * weights.에너지 +
                data.부식 * weights.부식 +
                data.환경 * weights.환경 +
                data.경제 * weights.경제
            );
        }

        // Find the amine with the highest score
        const recommendedAmine = Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b)[0];

        // Sort scores for display
        const sortedScores = Object.entries(scores)
            .sort((a, b) => b[1] - a[1])
            .map(([amine, score]) => ({ amine, score }));

        // Display results
        document.getElementById('recommendationText').textContent = `추천 기술: ${recommendedAmine}`;
        const tbody = document.getElementById('scoreTableBody');
        tbody.innerHTML = '';

        sortedScores.forEach(({ amine, score }) => {
            const row = tbody.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            cell1.textContent = amine;
            cell2.textContent = score.toFixed(2);
        });

        // Display technology description with copy functionality
        const descriptionDiv = document.createElement('div');
        descriptionDiv.style.marginTop = '15px';
        descriptionDiv.style.color = '#333';
        descriptionDiv.style.cursor = 'pointer';
        descriptionDiv.style.padding = '8px';
        descriptionDiv.style.borderRadius = '4px';
        descriptionDiv.style.border = '1px solid #ddd';
        descriptionDiv.style.backgroundColor = '#f8f9fa';
        descriptionDiv.textContent = `기술 설명: ${amineDescriptions[recommendedAmine]}`;
        
        descriptionDiv.onclick = function() {
            navigator.clipboard.writeText(amineDescriptions[recommendedAmine])
                .then(() => {
                    descriptionDiv.style.backgroundColor = '#e8f5e9';
                    descriptionDiv.style.borderColor = '#4CAF50';
                    setTimeout(() => {
                        descriptionDiv.style.backgroundColor = '#f8f9fa';
                        descriptionDiv.style.borderColor = '#ddd';
                    }, 1000);
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                    alert('텍스트 복사에 실패했습니다.');
                });
        };

        document.getElementById('resultBox').appendChild(descriptionDiv);
        document.getElementById('resultBox').style.display = 'block';
    } catch (error) {
        console.error('Error:', error);
        alert('추천 계산 중 오류가 발생했습니다. 모든 평가 요소를 선택했는지 확인해주세요.');
    }
}
