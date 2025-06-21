
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { TreePine, MessageSquare, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <TreePine className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tree Learning Interface
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Transform how you learn with AI through connected concepts and hierarchical understanding
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 text-left">
            <TreePine className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Tree Mode</h3>
            <p className="text-gray-600 text-sm mb-4">
              Visualize knowledge as connected nodes. See relationships between concepts and maintain context across different topics.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Interactive node-based exploration</li>
              <li>• Context-aware conversations</li>
              <li>• Visual knowledge mapping</li>
            </ul>
          </Card>

          <Card className="p-6 text-left">
            <MessageSquare className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Classic Mode</h3>
            <p className="text-gray-600 text-sm mb-4">
              Traditional chat interface with enhanced context awareness. See which concepts your questions relate to.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Linear conversation flow</li>
              <li>• Context node indicators</li>
              <li>• Full conversation history</li>
            </ul>
          </Card>
        </div>

        <Button 
          onClick={() => navigate('/tree-learning')}
          size="lg"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3"
        >
          Start Learning
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>

        <div className="mt-8 text-sm text-gray-500">
          <p>Perfect for academic research, skill development, and deep topic exploration</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
