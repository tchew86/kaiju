// KAIJU - Visual Learning Aids System
// Arrays, Number Lines, Skip Counting, Visual Patterns

class VisualLearningAids {
    constructor() {
        this.container = null;
    }

    // Show visual aid for a multiplication fact
    showMultiplicationAid(num1, num2, lang = 'en') {
        // Choose best visualization based on numbers
        if (num1 <= 5 && num2 <= 5) {
            return this.showArrayModel(num1, num2, lang);
        } else if (num1 === 10 || num2 === 10) {
            return this.showSkipCounting(Math.max(num1, num2), Math.min(num1, num2), lang);
        } else {
            return this.showNumberLine(num1, num2, lang);
        }
    }

    // Show visual aid for addition
    showAdditionAid(num1, num2, lang = 'en') {
        if (num1 + num2 <= 20) {
            return this.showCountingBlocks(num1, num2, lang);
        } else {
            return this.showNumberLine(num1, num2, lang, 'add');
        }
    }

    // Array model (dots in rows and columns)
    showArrayModel(rows, cols, lang = 'en') {
        const container = document.createElement('div');
        container.className = 'visual-aid array-model';
        container.style.cssText = `
            background: rgba(0, 0, 0, 0.9);
            border: 3px solid #00ff00;
            border-radius: 15px;
            padding: 30px;
            text-align: center;
        `;

        const title = document.createElement('div');
        title.style.cssText = `
            font-size: 1.5rem;
            font-weight: bold;
            color: #00ff00;
            margin-bottom: 20px;
        `;
        title.textContent = t('arrayModel', lang) || `${rows} × ${cols} Array`;

        const arrayGrid = document.createElement('div');
        arrayGrid.style.cssText = `
            display: inline-block;
            gap: 5px;
        `;

        // Create dots in array format
        for (let r = 0; r < rows; r++) {
            const row = document.createElement('div');
            row.style.cssText = `
                display: flex;
                gap: 10px;
                margin-bottom: 10px;
            `;

            for (let c = 0; c < cols; c++) {
                const dot = document.createElement('div');
                dot.style.cssText = `
                    width: 30px;
                    height: 30px;
                    background: radial-gradient(circle, #00ff00, #00aa00);
                    border-radius: 50%;
                    box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
                `;
                row.appendChild(dot);
            }

            arrayGrid.appendChild(row);
        }

        const explanation = document.createElement('div');
        explanation.style.cssText = `
            font-size: 1.2rem;
            color: #fff;
            margin-top: 20px;
        `;
        explanation.innerHTML = `
            <div>${rows} rows × ${cols} columns</div>
            <div style="font-size: 1.5rem; color: #ffaa00; margin-top: 10px;">
                = ${rows * cols}
            </div>
        `;

        container.appendChild(title);
        container.appendChild(arrayGrid);
        container.appendChild(explanation);

        return container;
    }

    // Number line visualization
    showNumberLine(num1, num2, lang = 'en', operation = 'multiply') {
        const container = document.createElement('div');
        container.className = 'visual-aid number-line';
        container.style.cssText = `
            background: rgba(0, 0, 0, 0.9);
            border: 3px solid #00ccff;
            border-radius: 15px;
            padding: 30px;
            text-align: center;
        `;

        const title = document.createElement('div');
        title.style.cssText = `
            font-size: 1.5rem;
            font-weight: bold;
            color: #00ccff;
            margin-bottom: 20px;
        `;
        title.textContent = operation === 'multiply' ?
            `Skip Count by ${num1}` :
            `Add ${num1} + ${num2}`;

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const answer = operation === 'multiply' ? num1 * num2 : num1 + num2;
        const maxVal = Math.min(answer, 120); // Cap at 120 for display
        const width = 800;
        const height = 150;

        svg.setAttribute('width', '100%');
        svg.setAttribute('height', height);
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

        // Draw main line
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', '50');
        line.setAttribute('y1', '75');
        line.setAttribute('x2', width - 50);
        line.setAttribute('y2', '75');
        line.setAttribute('stroke', '#00ccff');
        line.setAttribute('stroke-width', '3');
        svg.appendChild(line);

        // Draw tick marks and numbers
        const steps = operation === 'multiply' ? num2 : 1;
        const increment = operation === 'multiply' ? num1 : 1;
        const numTicks = Math.min(steps + 1, 11); // Max 11 ticks

        for (let i = 0; i <= numTicks; i++) {
            const value = i * increment;
            const x = 50 + ((width - 100) * i / numTicks);

            // Tick mark
            const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            tick.setAttribute('x1', x);
            tick.setAttribute('y1', '70');
            tick.setAttribute('x2', x);
            tick.setAttribute('y2', '80');
            tick.setAttribute('stroke', i === numTicks ? '#ffaa00' : '#00ccff');
            tick.setAttribute('stroke-width', i === numTicks ? '4' : '2');
            svg.appendChild(tick);

            // Number label
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', x);
            text.setAttribute('y', '100');
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('fill', i === numTicks ? '#ffaa00' : '#fff');
            text.setAttribute('font-size', i === numTicks ? '18' : '14');
            text.setAttribute('font-weight', i === numTicks ? 'bold' : 'normal');
            text.textContent = value;
            svg.appendChild(text);

            // Draw jump arcs for multiplication
            if (operation === 'multiply' && i > 0) {
                const prevX = 50 + ((width - 100) * (i - 1) / numTicks);
                const arc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const midX = (prevX + x) / 2;
                arc.setAttribute('d', `M ${prevX} 75 Q ${midX} 40 ${x} 75`);
                arc.setAttribute('stroke', '#00ff00');
                arc.setAttribute('stroke-width', '2');
                arc.setAttribute('fill', 'none');
                arc.setAttribute('stroke-dasharray', '5,5');
                svg.appendChild(arc);
            }
        }

        container.appendChild(title);
        container.appendChild(svg);

        return container;
    }

    // Skip counting visualization
    showSkipCounting(base, times, lang = 'en') {
        const container = document.createElement('div');
        container.className = 'visual-aid skip-counting';
        container.style.cssText = `
            background: rgba(0, 0, 0, 0.9);
            border: 3px solid #ffaa00;
            border-radius: 15px;
            padding: 30px;
            text-align: center;
        `;

        const title = document.createElement('div');
        title.style.cssText = `
            font-size: 1.5rem;
            font-weight: bold;
            color: #ffaa00;
            margin-bottom: 20px;
        `;
        title.textContent = `Count by ${base}s`;

        const countingRow = document.createElement('div');
        countingRow.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 15px;
            margin: 20px 0;
        `;

        for (let i = 1; i <= times; i++) {
            const value = base * i;
            const bubble = document.createElement('div');
            bubble.style.cssText = `
                width: 60px;
                height: 60px;
                background: ${i === times ?
                    'linear-gradient(135deg, #ffaa00, #ff6600)' :
                    'linear-gradient(135deg, #00ff00, #00aa00)'};
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.3rem;
                font-weight: bold;
                color: #fff;
                box-shadow: 0 5px 15px ${i === times ?
                    'rgba(255, 170, 0, 0.5)' :
                    'rgba(0, 255, 0, 0.3)'};
                border: 3px solid ${i === times ? '#ffaa00' : '#00ff00'};
            `;
            bubble.textContent = value;

            if (i === times) {
                bubble.style.transform = 'scale(1.3)';
            }

            countingRow.appendChild(bubble);
        }

        const explanation = document.createElement('div');
        explanation.style.cssText = `
            font-size: 1.2rem;
            color: #fff;
            margin-top: 20px;
        `;
        explanation.innerHTML = `
            <div>${base} + ${base} + ${base}... (${times} times)</div>
            <div style="font-size: 1.5rem; color: #ffaa00; margin-top: 10px;">
                = ${base * times}
            </div>
        `;

        container.appendChild(title);
        container.appendChild(countingRow);
        container.appendChild(explanation);

        return container;
    }

    // Counting blocks for addition
    showCountingBlocks(num1, num2, lang = 'en') {
        const container = document.createElement('div');
        container.className = 'visual-aid counting-blocks';
        container.style.cssText = `
            background: rgba(0, 0, 0, 0.9);
            border: 3px solid #ff00ff;
            border-radius: 15px;
            padding: 30px;
            text-align: center;
        `;

        const title = document.createElement('div');
        title.style.cssText = `
            font-size: 1.5rem;
            font-weight: bold;
            color: #ff00ff;
            margin-bottom: 20px;
        `;
        title.textContent = `${num1} + ${num2}`;

        const blocksContainer = document.createElement('div');
        blocksContainer.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 30px;
            align-items: flex-end;
            margin: 20px 0;
        `;

        // First group
        const group1 = this.createBlockGroup(num1, '#00ff00', num1.toString());
        blocksContainer.appendChild(group1);

        // Plus sign
        const plus = document.createElement('div');
        plus.style.cssText = `
            font-size: 3rem;
            color: #fff;
            font-weight: bold;
        `;
        plus.textContent = '+';
        blocksContainer.appendChild(plus);

        // Second group
        const group2 = this.createBlockGroup(num2, '#00ccff', num2.toString());
        blocksContainer.appendChild(group2);

        // Equals sign
        const equals = document.createElement('div');
        equals.style.cssText = `
            font-size: 3rem;
            color: #fff;
            font-weight: bold;
        `;
        equals.textContent = '=';
        blocksContainer.appendChild(equals);

        // Combined group
        const combined = this.createBlockGroup(num1 + num2, '#ffaa00', (num1 + num2).toString());
        blocksContainer.appendChild(combined);

        container.appendChild(title);
        container.appendChild(blocksContainer);

        return container;
    }

    // Helper: Create a group of counting blocks
    createBlockGroup(count, color, label) {
        const group = document.createElement('div');
        group.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
        `;

        const blocksGrid = document.createElement('div');
        blocksGrid.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            max-width: 150px;
            justify-content: center;
        `;

        for (let i = 0; i < count; i++) {
            const block = document.createElement('div');
            block.style.cssText = `
                width: 25px;
                height: 25px;
                background: ${color};
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
            `;
            blocksGrid.appendChild(block);
        }

        const labelEl = document.createElement('div');
        labelEl.style.cssText = `
            font-size: 1.5rem;
            font-weight: bold;
            color: ${color};
        `;
        labelEl.textContent = label;

        group.appendChild(blocksGrid);
        group.appendChild(labelEl);

        return group;
    }

    // Show visual aid in a modal
    showModal(num1, num2, operation = 'multiply', lang = 'en') {
        // Remove existing modal if present
        const existing = document.querySelector('.visual-aid-modal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.className = 'visual-aid-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 20px;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            max-width: 900px;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
        `;

        // Get visual aid
        let visualAid;
        if (operation === 'multiply') {
            visualAid = this.showMultiplicationAid(num1, num2, lang);
        } else {
            visualAid = this.showAdditionAid(num1, num2, lang);
        }

        content.appendChild(visualAid);

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✕';
        closeBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: #ff0000;
            color: #fff;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            font-size: 1.5rem;
            cursor: pointer;
            font-weight: bold;
            z-index: 10001;
        `;
        closeBtn.onclick = () => modal.remove();

        content.appendChild(closeBtn);
        modal.appendChild(content);

        // Close on background click
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };

        document.body.appendChild(modal);

        return modal;
    }

    // Show pattern visualization (for discovery)
    showPattern(table, lang = 'en') {
        const container = document.createElement('div');
        container.className = 'visual-aid pattern-discovery';
        container.style.cssText = `
            background: rgba(0, 0, 0, 0.9);
            border: 3px solid #ff00ff;
            border-radius: 15px;
            padding: 30px;
            text-align: center;
        `;

        const title = document.createElement('div');
        title.style.cssText = `
            font-size: 1.5rem;
            font-weight: bold;
            color: #ff00ff;
            margin-bottom: 20px;
        `;
        title.textContent = `${table} Times Table Pattern`;

        const patternGrid = document.createElement('div');
        patternGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
            gap: 15px;
            margin: 20px 0;
        `;

        for (let i = 1; i <= 10; i++) {
            const result = table * i;
            const card = document.createElement('div');
            card.style.cssText = `
                background: linear-gradient(135deg, #ff00ff, #aa00aa);
                padding: 15px;
                border-radius: 10px;
                border: 2px solid #ff00ff;
                box-shadow: 0 5px 15px rgba(255, 0, 255, 0.3);
            `;
            card.innerHTML = `
                <div style="font-size: 1.1rem; color: #fff;">${table} × ${i}</div>
                <div style="font-size: 1.8rem; font-weight: bold; color: #ffff00; margin-top: 5px;">${result}</div>
            `;
            patternGrid.appendChild(card);
        }

        // Pattern observation
        const observation = document.createElement('div');
        observation.style.cssText = `
            font-size: 1.1rem;
            color: #00ff00;
            margin-top: 20px;
            padding: 15px;
            background: rgba(0, 255, 0, 0.1);
            border-radius: 10px;
            border: 2px solid #00ff00;
        `;

        // Table-specific patterns
        const patterns = {
            2: "Even numbers only! Each answer ends in 0, 2, 4, 6, or 8.",
            5: "Answers end in 5 or 0! Easy to skip count.",
            9: "Digits add up to 9! (9=9, 18→1+8=9, 27→2+7=9)",
            10: "Just add a zero to the number!",
            11: "Up to 9: just repeat the digit! (11×3=33, 11×7=77)"
        };

        observation.textContent = patterns[table] || `Look for patterns in the last digits!`;

        container.appendChild(title);
        container.appendChild(patternGrid);
        container.appendChild(observation);

        return container;
    }
}

// Create global visual aids manager
const visualAids = new VisualLearningAids();
