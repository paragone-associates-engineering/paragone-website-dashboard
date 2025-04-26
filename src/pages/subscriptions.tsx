import { Button } from "@/components/ui/button"
import { ArrowUpRight, Edit } from "lucide-react"

interface SubscriptionPlan {
  name: string
  type: string
  price: string
  duration: string
  features: {
    name: string
    value?: string | number
  }[]
  color: string
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    name: "Beginners",
    type: "Starter",
    price: "₦100,000",
    duration: "1 month",
    features: [{ name: "Property Listing", value: 2 }, { name: "Associate Push" }],
    color: "bg-[#D5F7F6]",
  },
  {
    name: "Pro",
    type: "Professional",
    price: "₦300,000",
    duration: "3 months",
    features: [
      { name: "Property Listings", value: 5 },
      { name: "Social Media Advert", value: 1 },
      { name: "Sponsored Listing", value: 1 },
      { name: "Associate Push" },
    ],
    color: "bg-[#FFF1C5]",
  },
  {
    name: "Enterprise",
    type: "Commercial",
    price: "₦600,000",
    duration: "6 months",
    features: [
      { name: "Property Listing", value: 10 },
      { name: "Social Media Advert", value: 2 },
      { name: "Sponsored Listing" },
      { name: "Associate Push" },
      { name: "Designated Account Officer" },
    ],
    color: "bg-[#DEE3FF]",
  },
  {
    name: "Advance",
    type: "Large",
    price: "₦1,200,000",
    duration: "1 year",
    features: [
      { name: "Unlimited Property Listings" },
      { name: "Social Media Advert", value: 5 },
      { name: "Sponsored Listing" },
      { name: "Associate Push" },
      { name: "Designated Account Officer" },
    ],
    color: "bg-[#FEDEFF]",
  },
]

const Subscriptions = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Subscriptions</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {subscriptionPlans.map((plan, index) => (
          <div key={index} className={`rounded-lg border ${plan.color} p-6`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold">{plan.name}</h2>
                <p className="text-gray-600">{plan.type}</p>
              </div>
              <Button variant="outline" size="sm" className="h-8 px-3">
                <Edit className="h-4 w-4" />
                <span className="ml-1">Edit</span>
              </Button>
            </div>

            <div className="mb-6">
              <h3 className="text-3xl font-bold">{plan.price}/</h3>
              <p className="text-gray-600">{plan.duration}</p>
            </div>

            <div className="mb-6">
              <h4 className="font-medium mb-2">What's included:</h4>
              <ul className="space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      {feature.name}
                      {feature.value && ` ${feature.value}`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <Button variant="outline" className="w-full">
              <span>Subscribe</span>
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Subscriptions
