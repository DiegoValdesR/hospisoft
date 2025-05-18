import { ItemsModel } from "../../models/item/item.js";
import { AppointmentModel } from "../../models/appointments/appointments.js";

const GetItemsAndStock = async(req,res) =>{
    try {
        const findItems = await ItemsModel.findOne().sort({ item_stock: 1 }).select("item_name item_stock");
        return res.status(200).send({
            status:"completed",
            data:findItems
        })
    } catch (error) {
        return res.status(500).send({
            status:"error",
            message:"Error interno del servidor, por favor intentelo más tarde."
        })
    }
}

const GetMonthlyBilling = async (req, res) => {
  try {
    const now = new Date();

    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const currentMonthResult = await AppointmentModel.aggregate([
      {
        $match: {
          start_date: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
          appointment_state: "active"
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$appointment_price" }
        }
      }
    ]);

    const lastMonthResult = await AppointmentModel.aggregate([
      {
        $match: {
          start_date: { $gte: startOfLastMonth, $lte: endOfLastMonth },
          appointment_state: "active"
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$appointment_price" }
        }
      }
    ]);

    const currentMonthTotal = currentMonthResult.length > 0 ? currentMonthResult[0].total : 0;
    const lastMonthTotal = lastMonthResult.length > 0 ? lastMonthResult[0].total : 0;

    // Matematica durisima
    let differencePercentage = 0;
    if (lastMonthTotal > 0) {
      differencePercentage = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
    }

    return res.status(200).send({
      status: "completed",
      data: currentMonthTotal,
      difference: differencePercentage.toFixed(2)
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al calcular la facturación mensual."
    });
  }
};

const GetDoctorsWithMostAppointments = async (req, res) => {
  try {
    const doctorsData = await AppointmentModel.aggregate([
      {
        $match: {
          appointment_state: "active"
        }
      },
      {
        $group: {
          _id: "$doctor_id",
          totalAppointments: { $sum: 1 }
        }
      },
      {
        $sort: { totalAppointments: -1 }
      },
      {
        $lookup: {
          from: "workers",
          localField: "_id",
          foreignField: "_id",
          as: "doctorInfo"
        }
      },
      {
        $unwind: "$doctorInfo"
      },
      {
        $match: {
          "doctorInfo.worker_role": { $ne: "secretaria" }
        }
      },
      {
        $project: {
          doctor: {
            $concat: [
              "Dr. ",
              "$doctorInfo.worker_name",
            ]
          },
          appointments: "$totalAppointments",
          _id: 0
        }
      }
    ]);

    while (doctorsData.length < 3) {
      doctorsData.push({
        doctor: `N/A ${doctorsData.length + 1}`,
        appointments: 0
      });
    }

    return res.status(200).json({
      status: "completed",
      data: doctorsData
    });

  } catch (error) {
    console.error("Error en GetDoctorsWithMostAppointments:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al obtener los médicos con más citas."
    });
  }
};

const GetMonthlyPatients = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const monthlyPatients = await AppointmentModel.aggregate([
      {
        $match: {
          appointment_state: "active",
          start_date: {
            $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
            $lte: new Date(`${currentYear}-12-31T23:59:59.999Z`)
          }
        }
      },
      {
        $group: {
          _id: { $month: "$start_date" },
          totalPatients: { $sum: 1 }
        }
      },
      {
        $project: {
          month: "$_id",
          totalPatients: 1,
          _id: 0
        }
      },
      {
        $sort: { month: 1 }
      }
    ]);

    const data = Array.from({ length: 12 }, (_, i) => {
      const monthData = monthlyPatients.find(mp => mp.month === i + 1);
      return monthData ? monthData.totalPatients : 0;
    });

    return res.status(200).json({
      status: "completed",
      data
    });

  } catch (error) {
    console.error("Error en GetMonthlyPatients:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al obtener la cantidad mensual de pacientes."
    });
  }
};

export const DashMethods = {
    GetItemsAndStock,
    GetMonthlyBilling,
    GetDoctorsWithMostAppointments,
    GetMonthlyPatients
}