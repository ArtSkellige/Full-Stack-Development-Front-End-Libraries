class InvalidUserInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidUserInputError";
  }
}

interface FlashCard {
  questionText: string;
  questionAnswer: string;
}

let currentCards: FlashCard[] = [
  {
    questionText:
      "What was the official nickname of the specific F-15A Eagle aircraft that successfully launched the ASM-135 missile to destroy a satellite in 1985?",
    questionAnswer: "Celestial Eagle",
  },
  {
    questionText:
      'Which elite British military unit, formed during World War II, uses the famous motto "Who Dares Wins"?',
    questionAnswer: "Special Air Service (SAS)",
  },
  {
    questionText:
      "What legendary biblical/spectral moniker is given to the heavily armed, side-firing USAF AC-130 gunship variants—such as the AC-130A or AC-130U owing to their ability to unleash devastating night fire while performing a pylon turn?",
    questionAnswer: "Spectre (or Spooky)",
  },
  {
    questionText:
      "Which U.S. Army Infantry Fighting Vehicle (IFV), famously named after a highly decorated World War II general, is designed to transport infantry into battle while delivering heavy counter-armor fire with its 25mm Bushmaster chain gun and TOW missile launcher?",
    questionAnswer: "The Bradley",
  },
  {
    questionText:
      "What terrifying, classic aviation nickname is given to the Fairchild Republic A-10 Thunderbolt II, earned due to its aggressive, low-slung profile and the ferocious growl of its 30mm GAU-8 Avenger rotary cannon?",
    questionAnswer: "Warthog",
  },
  {
    questionText:
      "What intimidating, unofficial nickname did active-duty military pilots give to the F-35 Lightning II, mocking its stocky, single-engine silhouette, even though the official stealth program name pays homage to the legendary WWII P-38?",
    questionAnswer:
      'Fat Amy (The stealth fighter is also colloquially referred to as the "Panther")',
  },
  {
    questionText:
      "What aerodynamic capability allows the F-22 Raptor to sustain supersonic speeds above Mach 1.5 without using fuel-guzzling afterburners, giving its internal AMRAAM missiles unmatched kinetic energy?",
    questionAnswer: "Supercruise",
  },
  {
    questionText:
      "What specific, invisible military combat doctrine represents the EA-18G Growler's primary mission of blinding enemy radar systems, jamming communications, and deploying AGM-88 HARM missiles to obliterate hostile surface-to-air missile sites?",
    questionAnswer: "SEAD (Suppression of Enemy Air Defenses)",
  },
  {
    questionText:
      "What sleek, futuristic design feature on the B-21 Raider's fuselage is deeply blended to minimize its radar cross-section (RCS), making the massive aircraft look no larger than a small bird on enemy radar screens?",
    questionAnswer: "Flying wing",
  },
];

let currentIndex = 0;

const lockedQuestion = document.getElementById(
  "locked-question",
) as HTMLParagraphElement;
const cardAnswer = document.getElementById(
  "card-answer",
) as HTMLParagraphElement;
const flashcard = document.getElementById("flashcard") as HTMLDivElement;
const nextBtn = document.getElementById("next-btn") as HTMLButtonElement;
const prevBtn = document.getElementById("prev-btn") as HTMLButtonElement;
const deleteBtn = document.getElementById("delete-btn") as HTMLButtonElement;
const entryForm = document.getElementById("entry-form") as HTMLFormElement;
const frontText = document.getElementById("front-text") as HTMLTextAreaElement;
const backText = document.getElementById("back-text") as HTMLTextAreaElement;
const errorMessageDisplay = document.getElementById(
  "error-message",
) as HTMLParagraphElement;

function showFlashCard(): void {
  flashcard.classList.remove("flipped");

  if (currentCards.length === 0) {
    lockedQuestion.textContent = "No flashcards left!";
    cardAnswer.textContent = "";
    return;
  }

  const card = currentCards[currentIndex];
  lockedQuestion.textContent = card.questionText;
  cardAnswer.textContent = card.questionAnswer;
}

flashcard.addEventListener("click", (event: MouseEvent) => {
  if (currentCards.length === 0) return;
  flashcard.classList.toggle("flipped");
});

nextBtn.addEventListener("click", (event: MouseEvent) => {
  if (currentCards.length === 0) return;
  currentIndex = (currentIndex + 1) % currentCards.length;
  showFlashCard();
});

prevBtn.addEventListener("click", (event: MouseEvent) => {
  if (currentCards.length === 0) return;
  currentIndex = (currentIndex - 1 + currentCards.length) % currentCards.length;
  showFlashCard();
});

deleteBtn.addEventListener("click", (event: MouseEvent) => {
  if (currentCards.length === 0) return;

  currentCards.splice(currentIndex, 1);

  if (currentIndex >= currentCards.length && currentCards.length > 0) {
    currentIndex = currentCards.length - 1;
  }

  showFlashCard();
});

function validateInput(q: string, a: string): void {
  if (!q.trim() || !a.trim()) {
    throw new InvalidUserInputError(
      "Intel failure: Both question text and answer text must be filled out.",
    );
  }
}

entryForm.addEventListener("submit", (event: Event) => {
  event.preventDefault();
  errorMessageDisplay.textContent = "";

  try {
    const questionValue = frontText.value.trim();
    const answerValue = backText.value.trim();

    validateInput(questionValue, answerValue);

    const newCard: FlashCard = {
      questionText: questionValue,
      questionAnswer: answerValue,
    };

    currentCards.push(newCard);

    currentIndex = currentCards.length - 1;
    showFlashCard();
    entryForm.reset();
  } catch (error) {
    if (error instanceof InvalidUserInputError) {
      errorMessageDisplay.textContent = error.message;
    } else {
      throw error;
    }
  }
});

showFlashCard();
