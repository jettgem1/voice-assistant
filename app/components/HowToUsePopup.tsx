import { X } from "lucide-react";

interface HowToUsePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const HowToUsePopup: React.FC<HowToUsePopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">How to Use AutoMate</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          <section>
            <h3 className="text-xl font-semibold mb-2">Getting Started</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Click the green microphone button to start your conversation with AutoMate. The button will turn red and show a pulsing animation when active.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2">What You'll Need to Provide</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Your full name</li>
              <li>Vehicle information (make, model, year)</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2">Service Recommendations</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li><strong>Chrysler, Dodge, Jeep, RAM:</strong> Factory-recommended maintenance at 50k miles</li>
              <li><strong>Tesla, Polestar, Rivian, EVs:</strong> Battery replacement or charging port diagnosis</li>
              <li><strong>Other makes:</strong> Oil change, tire rotation, windshield wiper replacement</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2">Scheduling Availability</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li><strong>EVs:</strong> Available on odd hours until 5pm (Mon-Fri)</li>
              <li><strong>Hybrid/ICE:</strong> Available on even hours until 6pm (Mon-Fri)</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2">Ending the Call</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Click the red microphone button to end the call. Your appointment will be automatically scheduled and confirmed.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HowToUsePopup; 