"use server";

import prisma from "@/lib/prisma";

export async function createPopUp(
  title: string,
  description: string,
  startDate: Date,
  endDate: Date | null
) {
  const popUp = await prisma.popUp.create({
    data: {
      title,
      description,
      startDate,
      endDate,
    },
  });

  return popUp;
}

export async function getPopUp(id: string) {
  const popUp = await prisma.popUp.findUnique({
    where: {
      id,
    },
  });

  return popUp;
}

export async function putPopUp(
  popUpId: string,
  title: string,
  description: string,
  startDate: Date,
  endDate: Date | null
) {
  const result = await prisma.popUp.update({
    where: {
      id: popUpId,
    },
    data: {
      title,
      description,
      startDate,
      endDate,
    },
  });

  return result;
}

export async function deletePopUp(popUpId: string) {
  const result = await prisma.popUp.delete({
    where: {
      id: popUpId,
    },
  });

  return result;
}
