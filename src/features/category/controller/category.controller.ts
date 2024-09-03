import { Request, Response } from "express";
import { HTTP_STATUS } from "~/globals/constants/http";
import { categoryService } from "~/services/db/category.service";

class CategoryController {
  public async create(req: Request, res: Response) {
    const category = await categoryService.add(req.body);
    return res.status(HTTP_STATUS.CREATED).json({
      message: 'Create category',
      data: category
    })
  }

  public async getAll(req: Request, res: Response) {
    const categories = await categoryService.read();

    return res.status(HTTP_STATUS.OK).json({
      message: 'Get all categories',
      data: categories
    })
  }


  public async get(req: Request, res: Response) {
    const category = await categoryService.readOne(parseInt(req.params.id));

    return res.status(HTTP_STATUS.OK).json({
      message: 'Get category',
      data: category
    })
  }

  public async update(req: Request, res: Response) {
    const category = await categoryService.edit(parseInt(req.params.id), req.body);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Update category',
      data: category
    })
  }

  public async delete(req: Request, res: Response) {
    await categoryService.remove(parseInt(req.params.id));

    return res.status(HTTP_STATUS.OK).json({
      message: 'Delete category',
    })
  }

}

export const categoryController: CategoryController = new CategoryController();