import Navbar from "../components/Navbar";

export default function Contact() {
  const members = [
    {
      name: "S JAY NITIN",
      email: "jaynitin33@gmail.com",
      phone: "9831912952",
    },
    {
      name: "Saunak Roy Choudhary",
      email: "saunakrc29@gmail.com",
      phone: "8250373209",
    },
    {
      name: "Sankhadeep Chakraborty",
      email: "sankhadeepc49@gmail.com",
      phone: "9674113956",
    },
    {
      name: "Subham Samantal",
      email: "subhamsamanta010@gmail.com",
      phone: "9674113956",
    },
  ];

  return (
    <div className="min-h-screen bg-secondary/5">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-secondary/10 p-8 md:p-12">
          <h1 className="font-display text-3xl font-bold text-primary mb-2">
            Contact Us
          </h1>

          <p className="text-gray-500 mb-8">
            Get in touch with the EduPool development team.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {members.map((member) => (
              <div
                key={member.email}
                className="border border-secondary/10 rounded-xl p-5 hover:shadow-sm transition"
              >
                <h2 className="font-display text-xl font-semibold text-primary mb-4">
                  {member.name}
                </h2>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <a
                      href={`mailto:${member.email}`}
                      className="text-base text-quaternary hover:underline break-all"
                    >
                      {member.email}
                    </a>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <a
                      href={`tel:${member.phone}`}
                      className="text-base text-primary hover:text-quaternary transition"
                    >
                      {member.phone}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}