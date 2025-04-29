// app/admin/page.tsx
'use client';
import { useState } from 'react';
import SizeForm from '../../components/forms/sizeform';
import PackagingForm from '../../components/forms/packaging';
import ThinningForm from '../../components/forms/thinning';
import ArtForm from '../../components/forms/artwork';
import ColourCodeForm from '../../components/forms/colorcode';

const AdminPanel = () => {
  const [section, setSection] = useState<string>('size');

  return (
    <div className="p-6">
      <div className="flex gap-2 mb-4">
        {['size', 'packaging', 'thinning', 'art', 'colour'].map((name) => (
          <button key={name} onClick={() => setSection(name)} className="bg-blue-500 text-white px-4 py-2 rounded">
            {name}
          </button>
        ))}
      </div>
      <div>
        {section === 'size' && <SizeForm />}
        {section === 'packaging' && <PackagingForm />}
        {section === 'thinning' && <ThinningForm />}
        {section === 'art' && <ArtForm />}
        {section === 'colour' && <ColourCodeForm />}
      </div>
    </div>
  );
};

export default AdminPanel;
