import KnexService from '../../../database/connection';
import { IDefaultQuery } from '../../shared/interface/query.interface';
import { getFirst } from "../../shared/utils/utils";
import { ICreateComment, IFilterComment, IComment, IUpdateComment } from "../interface/comments.interface";

export default class CommentsDAO {
    async create(values: ICreateComment) {
        return getFirst(
            await KnexService('comments')
                .insert(values)
                .returning("*")
        )
    }
    async update(id: string, values: IUpdateComment) {
        return getFirst(
            await KnexService('comments')
                .update({ ...values })
                .where({ id })
                .returning("*")
        )
    }

    async getAll(filters: IFilterComment, sorts: IDefaultQuery): Promise<IComment[]> {

        const { order, orderBy, limit, offset } = sorts;
        const { user_id, entity_id } = filters;

        return await KnexService('comments')
            .select([
                "comments.*",
                "profiles.id as user.id",
                "profiles.full_name as user.full_name",
                "profiles.username as user.username",
                "profiles.image_src as user.image_src",

                KnexService.raw(`coalesce(jsonb_agg(distinct replies) filter (where replies.id is not null), '[]'::jsonb ) as replies`)
            ])
            .leftJoin(function () {
                this.select([
                    "comments.*",
                    "profiles.id as user.id",
                    "profiles.full_name as user.full_name",
                    "profiles.username as user.username",
                    "profiles.image_src as user.image_src",
                ])
                    .from("comments")
                    .as("replies")
                    .innerJoin("profiles", { "profiles.id": "comments.user_id" })
                    .groupBy("comments.id", "profiles.id")
            }, { "replies.parent_id": "comments.id" })
            .innerJoin("profiles", { "profiles.id": "comments.user_id" })
            .orderBy(`comments.${orderBy}`, order)
            .limit(limit)
            .offset(offset)
            .whereNull("comments.parent_id")
            .groupBy(
                'comments.id',
                "profiles.id"
            )
            .modify(q => {
                if (user_id) q.andWhere({ 'comments.user_id': user_id })
                if (entity_id) q.andWhere({ 'comments.entity_id': entity_id })
            })
    }

    async getById(id: string): Promise<IComment> {
        return getFirst(
            await KnexService('comments')
                .where({ id })
        )
    }

    async delete(where: IFilterComment): Promise<number> {
        return await KnexService('comments')
            .where(where)
            .delete()
    }
}