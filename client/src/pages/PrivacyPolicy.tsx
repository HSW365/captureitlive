import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sunset-50 via-warmth-50 to-ocean-50 dark:from-sunset-900 dark:via-ocean-900 dark:to-peace-900 pb-20 md:pb-0">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4" data-testid="back-button">
              <i className="fas fa-arrow-left mr-2"></i>
              Back to App
            </Button>
          </Link>
        </div>

        <Card className="glassmorphism">
          <CardContent className="p-8">
            <h1 className="text-3xl font-playfair font-bold text-slate-800 dark:text-white mb-6">
              Privacy Policy
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
              Last Updated: December 30, 2024
            </p>

            <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
                  1. Introduction
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  Welcome to CaptureIt™ ("we," "our," or "us"). We are committed to protecting your privacy 
                  and personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard 
                  your information when you use our mobile application and website (collectively, the "Service").
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
                  2. Information We Collect
                </h2>
                
                <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200 mb-3">
                  2.1 Personal Information
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  When you create an account, we collect:
                </p>
                <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2 mb-4">
                  <li>Name and email address</li>
                  <li>Profile information you choose to provide</li>
                  <li>Authentication credentials</li>
                </ul>

                <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200 mb-3">
                  2.2 Health and Biometric Data
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  With your explicit consent, we collect wellness-related data including:
                </p>
                <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2 mb-4">
                  <li>Heart rate and sleep patterns</li>
                  <li>Stress levels and mood tracking</li>
                  <li>Physical activity data (steps, exercise)</li>
                  <li>Mental wellness indicators</li>
                </ul>

                <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200 mb-3">
                  2.3 Usage Data
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  We automatically collect:
                </p>
                <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2">
                  <li>Device information (type, operating system)</li>
                  <li>App usage patterns and feature interactions</li>
                  <li>Log data and crash reports</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
                  3. How We Use Your Information
                </h2>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  We use your information to:
                </p>
                <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2">
                  <li>Provide personalized wellness insights and recommendations</li>
                  <li>Power AI-driven therapy and coaching features</li>
                  <li>Enable community features and social connections</li>
                  <li>Calculate and award karma points</li>
                  <li>Track environmental impact metrics</li>
                  <li>Improve and optimize our Service</li>
                  <li>Detect and respond to potential crisis situations</li>
                  <li>Communicate important updates and notifications</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
                  4. Data Sharing and Disclosure
                </h2>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  We do not sell your personal data. We may share information with:
                </p>
                <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2">
                  <li><strong>Service Providers:</strong> Third-party vendors who help operate our Service (hosting, analytics, AI processing)</li>
                  <li><strong>Community Features:</strong> Content you choose to share publicly with other users</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect safety</li>
                  <li><strong>Emergency Services:</strong> Crisis intervention contacts when immediate safety concerns are detected</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
                  5. AI and Automated Processing
                </h2>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  Our Service uses artificial intelligence to:
                </p>
                <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2">
                  <li>Analyze biometric data for wellness insights</li>
                  <li>Provide AI therapy and coaching conversations</li>
                  <li>Detect potential crisis situations requiring intervention</li>
                  <li>Personalize recommendations and content</li>
                </ul>
                <p className="text-slate-600 dark:text-slate-300 mt-4">
                  AI features are not a substitute for professional medical or mental health care. 
                  Always consult qualified professionals for serious health concerns.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
                  6. Data Security
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  We implement industry-standard security measures including encryption, secure servers, 
                  and access controls. However, no method of transmission over the Internet is 100% secure. 
                  We cannot guarantee absolute security of your data.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
                  7. Data Retention
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  We retain your data for as long as your account is active or as needed to provide services. 
                  You may request deletion of your account and associated data at any time. Some data may be 
                  retained for legal compliance or legitimate business purposes.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
                  8. Your Rights
                </h2>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  Depending on your location, you may have rights to:
                </p>
                <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2">
                  <li>Access and receive a copy of your personal data</li>
                  <li>Correct inaccurate or incomplete data</li>
                  <li>Delete your personal data</li>
                  <li>Restrict or object to certain processing</li>
                  <li>Data portability</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
                  9. Children's Privacy
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  Our Service is not intended for users under 13 years of age. We do not knowingly collect 
                  personal information from children under 13. If we become aware that we have collected 
                  data from a child under 13, we will take steps to delete such information.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
                  10. International Data Transfers
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  Your data may be transferred to and processed in countries other than your country of 
                  residence. We ensure appropriate safeguards are in place for such transfers in accordance 
                  with applicable data protection laws.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
                  11. Changes to This Policy
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  We may update this Privacy Policy from time to time. We will notify you of any material 
                  changes by posting the new policy on this page and updating the "Last Updated" date. 
                  Your continued use of the Service after changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
                  12. Contact Us
                </h2>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  If you have questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                  <p className="text-slate-700 dark:text-slate-300">
                    <strong>CaptureIt™</strong><br />
                    Email: privacy@captureit.live<br />
                    Website: https://captureit.live
                  </p>
                </div>
              </section>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/">
            <Button 
              className="bg-gradient-to-r from-sunset-500 via-warmth-500 to-ocean-500 hover:from-sunset-600 hover:via-warmth-600 hover:to-ocean-600"
              data-testid="return-home-button"
            >
              Return to CaptureIt™
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
