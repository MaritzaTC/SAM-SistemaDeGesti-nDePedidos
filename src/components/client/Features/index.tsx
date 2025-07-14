import { Truck, Shield, Recycle, Headphones } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Truck,
      title: "Envío Gratis",
      description: "Envío gratuito en compras superiores a $200.000. Entrega por servientrega.",
      color: "text-primary"
    },
    {
      icon: Shield,
      title: "Compra Segura",
      description: "Pagos 100% seguros con encriptación SSL. Aceptamos todas las tarjetas y PSE.",
      color: "text-chart-4"
    },
    {
      icon: Recycle,
      title: "Moda Sostenible",
      description: "Comprometidos con la sostenibilidad. Materiales eco-friendly y producción responsable.",
      color: "text-chart-2"
    },
    {
      icon: Headphones,
      title: "Soporte ",
      description: "Atención al cliente disponible. Te ayudamos en todo el proceso de compra.",
      color: "text-warning"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="text-center mb-16">
            <h2 className="text-4xl  font-bold text-foreground mb-4">
              ¿Por qué elegir Fashion Store?
            </h2>
            <p className="text-lg text-muted-foreground">
              Comprometidos con tu satisfacción y comodidad
            </p>
          </div>
      <div className="container mx-auto px-4 ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="card-feature group text-center animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-secondary/50 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`h-8 w-8 ${feature.color}`} />
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;