import { describe, it, expect } from 'vitest';
import {
  LYON_PARIS_EXAMPLE,
  LYON_PARIS_MISSION_SECTIONS,
  LYON_PARIS_SCRIPT,
  USER_RESPONSE_TEMPLATES,
  TIMING_CONFIG,
  getResponseByTrigger,
  getNextResponse,
  getRandomUserResponse,
} from './scriptedContent';

describe('Scripted Content System', () => {
  describe('LYON_PARIS_EXAMPLE', () => {
    it('should contain the exact user story example message', () => {
      expect(LYON_PARIS_EXAMPLE).toBe(
        "Hello, j'aurais besoin d'organiser un A/R Lyon-Paris pour 4 potes. On a un budget de 100€ max. Faut qu'on soit à Paris le vendredi 4 avril avant 20h et qu'on reparte le dimanche soir."
      );
    });
  });

  describe('LYON_PARIS_MISSION_SECTIONS', () => {
    it('should have all required sections from user story', () => {
      const sectionTitles = LYON_PARIS_MISSION_SECTIONS.map(section => section.title);
      
      expect(sectionTitles).toContain('Objectif');
      expect(sectionTitles).toContain('Contraintes');
      expect(sectionTitles).toContain('Livrable Clé');
      expect(sectionTitles).toContain('Critère de Succès Principal');
      expect(sectionTitles).toContain('Validateur');
      expect(sectionTitles).toContain('Contexte/Motivation');
    });

    it('should have correct initial statuses', () => {
      const objectifSection = LYON_PARIS_MISSION_SECTIONS.find(s => s.title === 'Objectif');
      const validateurSection = LYON_PARIS_MISSION_SECTIONS.find(s => s.title === 'Validateur');
      const livrableSection = LYON_PARIS_MISSION_SECTIONS.find(s => s.title === 'Livrable Clé');

      expect(objectifSection?.status).toBe('in_progress');
      expect(validateurSection?.status).toBe('confirmed');
      expect(livrableSection?.status).toBe('to_define');
    });

    it('should have options for interactive sections', () => {
      const livrableSection = LYON_PARIS_MISSION_SECTIONS.find(s => s.title === 'Livrable Clé');
      const critereSection = LYON_PARIS_MISSION_SECTIONS.find(s => s.title === 'Critère de Succès Principal');

      expect(livrableSection?.options).toHaveLength(2);
      expect(livrableSection?.options?.[0].label).toBe('Tableau Comparatif');
      expect(livrableSection?.options?.[1].label).toBe('Simple Liste des Options');

      expect(critereSection?.options).toHaveLength(2);
      expect(critereSection?.options?.[0].label).toBe('Prix le plus bas');
      expect(critereSection?.options?.[1].label).toBe('Temps de trajet minimal');
    });
  });

  describe('LYON_PARIS_SCRIPT', () => {
    it('should have responses for all phases', () => {
      const phases = [...new Set(LYON_PARIS_SCRIPT.map(response => response.phase))];
      expect(phases).toContain('A2');
      expect(phases).toContain('A3');
    });

    it('should have sequential steps within each phase', () => {
      const a2Responses = LYON_PARIS_SCRIPT.filter(r => r.phase === 'A2');
      const a3Responses = LYON_PARIS_SCRIPT.filter(r => r.phase === 'A3');

      // Check A2 steps are sequential
      const a2Steps = a2Responses.map(r => r.step).sort((a, b) => a - b);
      expect(a2Steps).toEqual([1, 2, 3, 4, 5, 6, 7]);

      // Check A3 steps are sequential
      const a3Steps = a3Responses.map(r => r.step).sort((a, b) => a - b);
      expect(a3Steps).toEqual([1, 2]);
    });

    it('should contain exact dialogue from user story', () => {
      const budgetResponse = LYON_PARIS_SCRIPT.find(r => r.id === 'clarification-budget-horaires');
      const confirmationResponse = LYON_PARIS_SCRIPT.find(r => r.id === 'confirmation-budget');
      const livrableResponse = LYON_PARIS_SCRIPT.find(r => r.id === 'livrable-suggestion');

      expect(budgetResponse?.content).toContain("Ok, ça marche pour le trip Lyon-Paris !");
      expect(budgetResponse?.content).toContain("le budget de 100€, c'est par tête ou pour tout le groupe ?");
      
      expect(confirmationResponse?.content).toBe("Super clair ! Budget max 400€ et départ >18h dimanche, c'est noté et validé.");
      
      expect(livrableResponse?.content).toContain("qu'est-ce que tu attends comme résultat concret");
      expect(livrableResponse?.content).toContain("tableau comparatif des options");
    });

    it('should have appropriate canvas updates', () => {
      const responses = LYON_PARIS_SCRIPT.filter(r => r.canvasUpdates && r.canvasUpdates.length > 0);
      
      expect(responses.length).toBeGreaterThan(0);
      
      // Check specific canvas updates
      const budgetResponse = LYON_PARIS_SCRIPT.find(r => r.id === 'clarification-budget-horaires');
      expect(budgetResponse?.canvasUpdates?.[0].sectionId).toBe('contraintes');
      expect(budgetResponse?.canvasUpdates?.[0].highlight).toBe(true);
    });

    it('should have realistic timing delays', () => {
      LYON_PARIS_SCRIPT.forEach(response => {
        expect(response.delay).toBeGreaterThan(0);
        expect(response.delay).toBeLessThanOrEqual(5000); // Max 5 seconds
      });
    });
  });

  describe('Helper Functions', () => {
    describe('getResponseByTrigger', () => {
      it('should find response by trigger condition and phase', () => {
        const response = getResponseByTrigger('user_message_sent', 'A2');
        
        expect(response).toBeDefined();
        expect(response?.id).toBe('clarification-budget-horaires');
        expect(response?.phase).toBe('A2');
      });

      it('should return undefined for non-existent trigger', () => {
        const response = getResponseByTrigger('non_existent_trigger', 'A2');
        expect(response).toBeUndefined();
      });
    });

    describe('getNextResponse', () => {
      it('should find next response in sequence', () => {
        const nextResponse = getNextResponse('A2', 1);
        
        expect(nextResponse).toBeDefined();
        expect(nextResponse?.phase).toBe('A2');
        expect(nextResponse?.step).toBe(2);
      });

      it('should return undefined when no next response exists', () => {
        const nextResponse = getNextResponse('A3', 10);
        expect(nextResponse).toBeUndefined();
      });
    });

    describe('getRandomUserResponse', () => {
      it('should return a valid response template', () => {
        const response = getRandomUserResponse('budget_clarification');
        
        expect(response).toBeDefined();
        expect(typeof response).toBe('string');
        expect(USER_RESPONSE_TEMPLATES.budget_clarification).toContain(response);
      });

      it('should return different responses on multiple calls', () => {
        const responses = new Set();
        
        // Call multiple times to test randomness
        for (let i = 0; i < 10; i++) {
          responses.add(getRandomUserResponse('context_responses'));
        }
        
        // Should have at least some variation (not always the same)
        expect(responses.size).toBeGreaterThan(0);
      });
    });
  });

  describe('TIMING_CONFIG', () => {
    it('should have all required timing configurations', () => {
      expect(TIMING_CONFIG.TYPING_DELAY).toBeDefined();
      expect(TIMING_CONFIG.THINKING_DELAY).toBeDefined();
      expect(TIMING_CONFIG.CANVAS_UPDATE_DELAY).toBeDefined();
      expect(TIMING_CONFIG.USER_RESPONSE_DELAY).toBeDefined();
      expect(TIMING_CONFIG.PHASE_TRANSITION_DELAY).toBeDefined();
    });

    it('should have realistic timing values', () => {
      expect(TIMING_CONFIG.TYPING_DELAY).toBeGreaterThan(0);
      expect(TIMING_CONFIG.THINKING_DELAY).toBeGreaterThan(0);
      expect(TIMING_CONFIG.CANVAS_UPDATE_DELAY).toBeGreaterThan(0);
      expect(TIMING_CONFIG.USER_RESPONSE_DELAY).toBeGreaterThan(0);
      expect(TIMING_CONFIG.PHASE_TRANSITION_DELAY).toBeGreaterThan(0);
    });
  });

  describe('USER_RESPONSE_TEMPLATES', () => {
    it('should have templates for all interaction types', () => {
      expect(USER_RESPONSE_TEMPLATES.budget_clarification).toBeDefined();
      expect(USER_RESPONSE_TEMPLATES.context_responses).toBeDefined();
      expect(USER_RESPONSE_TEMPLATES.confirmation_responses).toBeDefined();
    });

    it('should have multiple options for each template type', () => {
      Object.values(USER_RESPONSE_TEMPLATES).forEach(templates => {
        expect(templates.length).toBeGreaterThan(1);
      });
    });
  });
});
