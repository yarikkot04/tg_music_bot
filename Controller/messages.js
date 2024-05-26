const messages = {
  startBotMsg: 'Bot started!',
  eng: {
    greetings: 'Hello! You are greeted by Everain_Music_bot. Here you can find music for every taste. For a more detailed description of the bot\'s capabilities, use the command /help.',
    chooseLanguage: 'Choose your language:',
    languages: ['English', 'Ukrainian'],
    chatLang: 'Chat language: English',
    chooseFormat: 'Choose a format for download: ',
    downloadFormat: 'Download format: ',
    chooseMethod: 'Choose a download method:',
    downloadMethods: ['Name', 'Link'],
    downloadMethod: 'Download method: ',
    downloadedFromMsg: 'Downloaded from @Everain_bot',
    noValidSong: 'No valid songs found',
    emptyHistory: 'History is empty',
    historyMsg: 'Your song history: ',
    helpMessage: `Bot Documentation:
    /start - start a chat with the bot
    /help - get help information
    /choose_language - choose a language
    /choose_format - select a download format
    /choose_method - select a download method (Name | Link)
    /history - view download history (last 10)`,
    searchResults: 'Search results: '
  },
  ukr: {
    greetings: 'Привіт! Тебе вітає Everain_Music_bot. Тут ти зможеш знайти музику на будь-який смак. Для більш детального опису можливостей бота скористайся командою /help.',
    chooseLanguage: 'Виберіть мову:',
    languages: ['Англійська', 'Українська'],
    chatLang: 'Мова чату : Українська',
    chooseFormat: 'Виберіть формат для завантаження: ',
    downloadFormat: 'Формат скачування: ',
    chooseMethod: 'Оберіть метод скачування:',
    downloadMethods: ['Ім\'я', 'Посилання'],
    downloadMethod: 'Метод скачування: ',
    downloadedFromMsg: 'Скачано з @Everain_bot',
    noValidSong: 'Не знайдено жодної дійсної пісні',
    emptyHistory: 'Історія порожня',
    historyMsg: 'Історія вашої музики: ',
    helpMessage: `Документація щодо бота:
    /start - розпочати чат із ботом
    /help - отримати довідкову інформацію
    /choose_language - обрати мову
    /choose_format - обрати формат завантаження
    /choose_method - обрати метод завантаження (Назва | Лінк)
    /history - переглянути історію завантажень (останні 10)`,
    searchResults: 'Результати пошуку: '
  },
  server_errors: {
    sendAudio: 'Error sending audio: ',
    sendVideo: 'Error sending video: ',
    deleteFile: 'Error deleting file:',
    noVideoIdFind: 'No video id found',
    notFoundVideoFormat: 'Video format not found',
    notFoundAudioFormat: 'Audio format not found'
  }
}

export default messages
