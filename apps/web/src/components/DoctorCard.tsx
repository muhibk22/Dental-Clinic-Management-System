interface DoctorProps {
  name: string;
  specialization: string;
  experience: number;
  photoUrl: string;
}

export default function DoctorCard({ name, specialization, experience, photoUrl }: DoctorProps) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
      <div className="h-64 bg-gray-200 relative overflow-hidden">
        <img src={photoUrl} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
      </div>
      <div className="p-6 text-center">
        <h3 className="text-xl font-bold text-oradent-blue">{name}</h3>
        <p className="text-oradent-teal text-sm font-medium">{specialization}</p>
        <p className="text-gray-400 text-xs mt-2 font-bold uppercase">{experience} Years Experience</p>
        <button className="mt-6 w-full py-2 border-2 border-oradent-blue text-oradent-blue rounded-xl font-bold hover:bg-oradent-blue hover:text-white transition-colors">
          View Profile
        </button>
      </div>
    </div>
  );
}