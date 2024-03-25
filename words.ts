export let isFiveLetterWord = (word:string):boolean => {
    if (word.length === 5) {
  
        return true;
    }
    return false;
  }
  
  export let getFiveLetterWords = (wordArray: string[]): string[] => {
    return wordArray.filter((word: string) => {
        return isFiveLetterWord(word);
    });
  }
  
  export let toUpperCase = (wordArray: string[]): string[] => {
    return wordArray.map((word: string) => {
        return word.toUpperCase();
    });
  }
  
  export let getRandomWord = (wordArray:string[]):string => {
    const randomIndex: number = Math.floor(Math.random() * wordArray.length); 
      return wordArray[randomIndex];
  }