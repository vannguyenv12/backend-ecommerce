import { Request, Response } from "express";
import { HTTP_STATUS } from "~/globals/constants/http";
import { addressService } from "~/services/db/address.service";

class AddressController {
  public async addAddress(req: Request, res: Response) {
    const address = await addressService.add(req.body, req.currentUser);

    return res.status(HTTP_STATUS.CREATED).json({
      message: 'Add address',
      data: address
    });
  }

  public async updateAddress(req: Request, res: Response) {
    const address = await addressService.update(parseInt(req.params.id), req.body, req.currentUser)

    return res.status(HTTP_STATUS.OK).json({
      message: 'update address',
      data: address
    });
  }


  public async delete(req: Request, res: Response) {
    await addressService.remove(parseInt(req.params.id), req.currentUser);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Delete address'
    })
  }

  public async getMyAddress(req: Request, res: Response) {
    const addresses = await addressService.getAll(req.currentUser);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Get my address',
      data: addresses
    })
  }
}

export const addressController: AddressController = new AddressController();