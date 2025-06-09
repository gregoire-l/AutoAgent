/**
 * Mission Clarification Interface - JavaScript Functionality
 * 
 * This file contains all interactive functionality for the mission clarification interface,
 * including accordion toggles, suggestion selections, and status management.
 */

// ===== ACCORDION FUNCTIONALITY =====

/**
 * Toggle accordion open/close state
 * @param {HTMLElement} accordionItem - The accordion item to toggle
 */
function toggleAccordion(accordionItem) {
    accordionItem.classList.toggle('accordion-item--open');
}

// ===== SUGGESTION SELECTION =====

/**
 * Handle suggestion option selection
 * @param {HTMLElement} element - The selected suggestion option element
 * @param {string} groupName - The name of the suggestion group
 */
function selectSuggestion(element, groupName) {
    const parentContainer = element.closest('.suggestion-capsule');
    const options = parentContainer.querySelectorAll('.suggestion-option');
    options.forEach(opt => { if (opt !== element) opt.classList.remove('suggestion-option--selected'); });
    element.classList.add('suggestion-option--selected');
    const section = parentContainer.closest('.section');
    if (section) {
        section.classList.remove('status-suggestion');
        section.classList.add('status-confirmed');
        updateSectionMarginBar(section);
    }
    checkAllConfirmed();
}

// ===== CRITERIA CONFIRMATION =====

/**
 * Confirm a suggested criteria item
 * @param {HTMLElement} criteriaItemElement - The criteria item to confirm
 */
function confirmCriteria(criteriaItemElement) {
    if (criteriaItemElement.classList.contains('item-suggested')) {
        criteriaItemElement.classList.remove('item-suggested');
        criteriaItemElement.classList.add('item-confirmed');

        const suggestionIconContainer = criteriaItemElement.querySelector('.criteria-item-prefix .suggestion-indicator-icon');
        if (suggestionIconContainer) suggestionIconContainer.style.display = 'none';

        const priorityBadge = criteriaItemElement.querySelector('.criteria-item-prefix .priority-badge');
        if (priorityBadge) priorityBadge.style.opacity = '1';
    }
    checkAllConfirmed();
}

// ===== STATUS MANAGEMENT =====

/**
 * Check if all sections are confirmed
 */
function checkAllConfirmed() {
    const sections = document.querySelectorAll('.canvas-panel .section');
    let allConfirmed = true;
    sections.forEach(s => { if (!s.classList.contains('status-confirmed')) allConfirmed = false; });
}

/**
 * Update the margin bar color based on section status
 * @param {HTMLElement} sectionElement - The section element to update
 */
function updateSectionMarginBar(sectionElement) {
    const barLine = sectionElement.querySelector('.main-margin-bar-line');
    let color = 'transparent';
    if (sectionElement.classList.contains('status-confirmed')) color = '#10B981';
    else if (sectionElement.classList.contains('status-in-discussion')) color = '#F59E0B';
    else if (sectionElement.classList.contains('status-suggestion')) color = '#3B82F6';
    else if (sectionElement.classList.contains('status-unaddressed')) color = 'rgba(113, 113, 122, 0.2)';
    if (barLine) barLine.style.backgroundColor = color;
}

// ===== DOM INITIALIZATION =====

/**
 * Initialize the interface when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    checkAllConfirmed(); 
    document.querySelectorAll('.section').forEach(section => {
        updateSectionMarginBar(section);
    });

    const timelineNodes = document.querySelectorAll('.timeline-node');
    const legendItems = document.querySelectorAll('.milestone-legend-item');

    timelineNodes.forEach(node => {
        const targetId = node.dataset.target;
        const targetElement = document.getElementById(targetId);

        // Appliquer l'état (pour la démo, normalement géré par la logique métier)
        if (targetElement) {
            // Simuler des états pour la démo
            if (node.textContent === "1") {
                targetElement.classList.add('item-suggested');
                targetElement.classList.remove('item-confirmed');
            } else if (node.textContent === "2") {
                 targetElement.classList.add('item-confirmed');
                 targetElement.classList.remove('item-suggested');
            }
        }

        node.addEventListener('click', () => {
            if (targetElement) {
                legendItems.forEach(openItem => {
                    if (openItem !== targetElement) {
                        openItem.classList.remove('accordion-item--open');
                    }
                });
                toggleAccordion(targetElement);
                // targetElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    });
});
