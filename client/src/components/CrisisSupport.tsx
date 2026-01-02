import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CrisisSupportProps {
  onConnectCounselor?: () => void;
  onViewContacts?: () => void;
}

export default function CrisisSupport({ onConnectCounselor, onViewContacts }: CrisisSupportProps) {
  const emergencyContacts = [
    { region: "US", service: "Suicide & Crisis Lifeline", number: "988" },
    { region: "US", service: "Crisis Text Line", number: "Text HOME to 741741" },
    { region: "UK", service: "Samaritans", number: "116 123" },
    { region: "International", service: "International Association for Suicide Prevention", number: "Visit iasp.info" },
  ];

  return (
    <Card className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800" data-testid="crisis-support">
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
            <i className="fas fa-phone text-white"></i>
          </div>
          <div>
            <h3 className="font-semibold text-red-800 dark:text-red-200">Crisis Support</h3>
            <p className="text-red-600 dark:text-red-300 text-sm">24/7 Emergency Assistance</p>
          </div>
        </div>

        <Alert className="mb-4 border-red-300 bg-red-100 dark:bg-red-900/30">
          <i className="fas fa-heart text-red-500"></i>
          <AlertDescription className="text-red-800 dark:text-red-200">
            <strong>You are not alone.</strong> If you're having thoughts of self-harm or suicide, 
            immediate help is available. Your life has value and meaning.
          </AlertDescription>
        </Alert>

        <p className="text-red-700 dark:text-red-300 text-sm mb-4">
          If you're experiencing a mental health crisis or having thoughts of self-harm, 
          please reach out immediately. Professional support is available 24/7.
        </p>
        
        <div className="space-y-3 mb-6">
          <Button 
            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium"
            onClick={onConnectCounselor}
            data-testid="connect-counselor-button"
          >
            <i className="fas fa-user-md mr-2"></i>
            Connect with Crisis Counselor
          </Button>
          
          <Button 
            variant="outline"
            className="w-full border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
            onClick={onViewContacts}
            data-testid="emergency-contacts-button"
          >
            <i className="fas fa-address-book mr-2"></i>
            View Emergency Contacts
          </Button>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-red-800 dark:text-red-200 text-sm">Emergency Hotlines</h4>
          {emergencyContacts.map((contact, index) => (
            <div 
              key={index} 
              className="flex justify-between items-center text-xs bg-white/50 dark:bg-black/20 rounded p-2"
              data-testid={`emergency-contact-${index}`}
            >
              <div>
                <span className="font-medium text-red-800 dark:text-red-200">{contact.region}:</span>
                <span className="text-red-700 dark:text-red-300 ml-1">{contact.service}</span>
              </div>
              <span className="font-mono text-red-600 dark:text-red-400">{contact.number}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-red-200 dark:border-red-800">
          <p className="text-xs text-red-600 dark:text-red-400 text-center">
            <i className="fas fa-lock mr-1"></i>
            All crisis support interactions are confidential and secure
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
