import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/lib/types";

interface ProfileModalProps {
  user: User;
  onClose: () => void;
}

const ProfileModal = ({ user, onClose }: ProfileModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" onClick={onClose}>
      <Card className="max-w-md" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>First Name:</strong> {user.firstName}</p>
          <p><strong>Last Name:</strong> {user.lastName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Company:</strong> {user.company}</p>
          <p><strong>Tier:</strong> {user.tier}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileModal;