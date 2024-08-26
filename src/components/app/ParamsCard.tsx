import { ChangeEvent, FC } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ElectionParams } from '@/files/params';

interface ParamsCardProps {
  formData: Record<string, string>;
  setFormData: (data: Record<string, string>) => void;
}

const ParamsCard: FC<ParamsCardProps> = ({ formData, setFormData }) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  return (
    <Card className="max-w-4xl w-full">
      <CardHeader className="pb-4">
        <CardTitle>Election Details</CardTitle>
        <CardDescription>Please fill in the details below to generate your 83(b) election form.</CardDescription>
      </CardHeader>

      <Separator />

      <CardContent className="pt-4">
        <form className="space-y-4">
          {ElectionParams.map((param) => (
            <div key={param.id}>
              <Label htmlFor={param.id} className="block mb-2">
                {param.name} {param.required && <span className="text-red-500">*</span>}
              </Label>
              {param.description && <p className="text-sm text-gray-500 mb-1">{param.description}</p>}
              <Input
                id={param.id}
                type={param.type}
                value={formData[param.id]}
                onChange={handleInputChange}
                required={param.required}
                className="w-full"
              />
            </div>
          ))}
        </form>
      </CardContent>
    </Card>
  );
};

export default ParamsCard;
