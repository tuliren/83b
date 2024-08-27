import { ChangeEvent, FC } from 'react';

import BaseCard from '@/components/app/BaseCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ELECTION_PARAMS } from '@/files/constants';
import { FormDataMap } from '@/params/common';
import { evaluateParams } from '@/params/paramHelpers';

interface ParamsCardProps {
  formData: FormDataMap;
  setFormData: (data: FormDataMap) => void;
}

const ParamsCard: FC<ParamsCardProps> = ({ formData, setFormData }) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const newFormData = evaluateParams({ ...formData, [id]: value }, ELECTION_PARAMS);
    setFormData(newFormData);
  };

  const handleBooleanChange = (id: string, value: string) => {
    const newFormData = evaluateParams({ ...formData, [id]: value }, ELECTION_PARAMS);
    setFormData(newFormData);
  };

  return (
    <BaseCard
      title="Election Details"
      description="Please fill in the details below to generate your 83(b) election form."
    >
      <form className="space-y-4">
        {ELECTION_PARAMS.filter((param) => param.paramType !== 'calculated').map((param) => {
          switch (param.valueType) {
            case 'string':
            case 'number':
            case 'date': {
              return (
                <div key={param.id}>
                  <Label htmlFor={param.id} className="block mb-2">
                    {param.name} {param.paramType === 'required' && <span className="text-red-500">*</span>}
                  </Label>
                  {param.description && <p className="text-sm text-gray-500 mb-1">{param.description}</p>}
                  <Input
                    id={param.id}
                    type={param.valueType}
                    placeholder={param.placeholder}
                    value={formData[param.id] as string | number}
                    onChange={handleInputChange}
                    required={param.paramType === 'required'}
                    className="w-full"
                  />
                </div>
              );
            }
            case 'boolean': {
              return (
                <div key={param.id}>
                  <Label htmlFor={param.id} className="block mb-2">
                    {param.name} {param.paramType === 'required' && <span className="text-red-500">*</span>}
                  </Label>
                  <Select
                    value={formData[param.id] as string | undefined}
                    onValueChange={(value: string) => handleBooleanChange(param.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={param.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              );
            }
          }
        })}
      </form>
    </BaseCard>
  );
};

export default ParamsCard;
