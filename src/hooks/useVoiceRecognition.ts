import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";

interface UseVoiceRecognitionProps {
  onResult: (transcript: string) => void;
  onError?: (error: string) => void;
  continuous?: boolean;
  language?: string;
}

export const useVoiceRecognition = ({
  onResult,
  onError,
  continuous = false,
  language = "en-US",
}: UseVoiceRecognitionProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if browser supports Web Speech API
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        setIsSupported(true);
        recognitionRef.current = new SpeechRecognition();

        const recognition = recognitionRef.current;
        recognition.continuous = continuous;
        recognition.interimResults = true;
        recognition.lang = language;

        recognition.onstart = () => {
          setIsListening(true);
          toast.info("🎤 Listening...");
        };

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result) => result.transcript)
            .join("");

          if (event.results[0].isFinal) {
            onResult(transcript);
          }
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);

          const errorMessage = getErrorMessage(event.error);
          onError?.(errorMessage);
          toast.error(errorMessage);
        };

        recognition.onend = () => {
          setIsListening(false);
        };
      } else {
        setIsSupported(false);
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [continuous, language, onResult, onError]);

  const startListening = useCallback(() => {
    if (!isSupported) {
      toast.error("Voice recognition is not supported in your browser");
      return;
    }

    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error: any) {
        console.error("Error starting recognition:", error);
        toast.error("Failed to start voice recognition");
      }
    }
  }, [isSupported, isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      toast.success("Voice input stopped");
    }
  }, [isListening]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
    toggleListening,
  };
};

function getErrorMessage(error: string): string {
  switch (error) {
    case "no-speech":
      return "No speech detected. Please try again.";
    case "audio-capture":
      return "Microphone not available. Please check permissions.";
    case "not-allowed":
      return "Microphone access denied. Please enable in browser settings.";
    case "network":
      return "Network error occurred. Please check your connection.";
    case "aborted":
      return "Voice recognition was aborted.";
    default:
      return `Voice recognition error: ${error}`;
  }
}
